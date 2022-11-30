import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CollateralStatus } from "../entities/collateral.entity";
import { Offer, OfferStatus } from "../entities/offer.entity";
import { Ownership } from "../entities/ownership.entity";
import { OwnershipService } from "../ownership/ownership.service";
import { AcceptOfferDto } from "./dto/accept-offer.dto";
import { AddReceiptDto } from "./dto/add-receipt.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        private readonly usersService: UsersService,
        private readonly ownershipService: OwnershipService,
    ) {}

    async getOffersByOwnership(ownershipId: string) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: ownershipId,
            },
            relations: ["offers"],
        });

        return ownership.offers;
    }

    async getOffersByUser(userId: string) {
        const user = await this.usersService.findUserByQuery({
            where: {
                id: userId,
            },
            relations: [
                "ownerships.offers.ownership.tokenizedAsset",
                "ownerships.offers.currentBuyer",
            ],
        });

        return user.ownerships
            .flatMap((o) => o.offers)
            .filter(
                (o) =>
                    ![
                        OfferStatus.CANCELED.toString(),
                        OfferStatus.ACCEPTED.toString(),
                    ].includes(o.status.toString()),
            );
    }

    async getOffersByBuyer(userId: string) {
        const user = await this.usersService.findUserByQuery({
            where: {
                id: userId,
            },
            relations: [
                "requestedOffers.ownership.tokenizedAsset",
                "requestedOffers.ownership.user",
            ],
        });

        return user.requestedOffers;
    }

    async getOffersById(offerId: string) {
        const offer = await this.offerRepository.findOneOrFail({
            where: {
                id: offerId,
            },
            relations: [
                "ownership",
                "ownership.tokenizedAsset",
                "ownership.user",
            ],
        });

        return offer;
    }

    async addReceiptOnOffer(data: AddReceiptDto) {
        const offer = await this.offerRepository.findOneOrFail({
            where: {
                id: data.offerId,
            },
        });

        offer.receipt = data.receipt;
        await this.offerRepository.save(offer);
    }

    async getAllOffersByStatus(status: string) {
        const offers = await this.offerRepository.find({
            where: {
                status: OfferStatus[status],
            },
            relations: [
                "ownership",
                "ownership.tokenizedAsset",
                "ownership.user",
                "currentBuyer",
            ],
        });

        return offers;
    }

    async acceptOffer(data: AcceptOfferDto) {
        const { offerId, userId } = data;

        const offer = await this.offerRepository.findOneOrFail({
            where: {
                id: offerId,
            },
            relations: ["ownership", "ownership.user"],
        });

        if (offer.ownership.user.id === userId)
            throw new ForbiddenException("Buyer can't have same id as Seller");

        if (offer.status.toString() !== OfferStatus.AVAILABLE.toString())
            throw new ForbiddenException("Offer must be AVAILABLE");

        const user = await this.usersService.findOneOrFail({ id: userId });
        if (!user.walletAddress)
            throw new ForbiddenException("Buyer doesn't have wallet");

        offer.status = OfferStatus.WAITING_PAYMENT.toString();
        offer.currentBuyer = user;
        await this.offerRepository.save(offer);

        return offer;
    }

    async validateOfferPayment(id: string) {
        const offer = await this.offerRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: [
                "ownership",
                "currentBuyer",
                "ownership.tokenizedAsset",
                "ownership.user",
            ],
        });

        if (offer.status.toString() !== OfferStatus.WAITING_PAYMENT.toString())
            throw new ForbiddenException("Offer must be WAITING_PAYMENT");

        const ownershipTransfer = {
            buyerUserId: offer.currentBuyer.id,
            contractAddress: offer.ownership.tokenizedAsset.contractAddress,
            isEffectiveOwnerTransfer: offer.isEffectiveTransfer,
            sellerUserId: offer.ownership.user.id,
            transferShares: offer.percentage,
        };
        const ownership =
            await this.ownershipService.upsertOwnershipFromTransfer(
                ownershipTransfer,
            );

        offer.status = OfferStatus.ACCEPTED.toString();
        await this.offerRepository.save(offer);

        return ownership;
    }

    async rejectOfferPayment(id: string) {
        const offer = await this.offerRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: [
                "ownership",
                "currentBuyer",
                "ownership.tokenizedAsset",
                "ownership.user",
            ],
        });

        if (offer.status.toString() !== OfferStatus.WAITING_PAYMENT.toString())
            throw new ForbiddenException("Offer must be WAITING_PAYMENT");

        offer.status = OfferStatus.AVAILABLE.toString();
        offer.currentBuyer = null;

        return await this.offerRepository.save(offer);
    }

    async createOffer(data: CreateOfferDto) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: data.ownershipId,
            },
            relations: ["offers", "collaterals"],
        });

        const availableOffers = ownership.offers.filter(
            (o) =>
                o.status.toString() === OfferStatus.AVAILABLE.toString() ||
                o.status.toString() === OfferStatus.WAITING_PAYMENT.toString(),
        );

        if (data.isEffectiveTransfer && !ownership.isEffectiveOwner)
            throw new ForbiddenException("Vendedor não é proprietário efetivo");

        if (
            data.isEffectiveTransfer &&
            availableOffers.some((o) => o.isEffectiveTransfer)
        )
            throw new ForbiddenException(
                "Oferta com transferência de posse já existente",
            );

        if (data.percentage === 0 && !data.isEffectiveTransfer)
            throw new ForbiddenException(
                "Não é possível oferecer porcentagem 0",
            );

        const sellerCollateralTotal = ownership.collaterals
            .filter(
                (c) =>
                    c.status.toString() ===
                        CollateralStatus.ACTIVE.toString() ||
                    c.status.toString() ===
                        CollateralStatus.PENDING_CONFIRMATION.toString(),
            )
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        const offered = Math.round(data.percentage * 1000) / 1000;

        const sellerOfferTotal = availableOffers
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        const total =
            Math.round(
                (ownership.percentageOwned -
                    sellerCollateralTotal -
                    sellerOfferTotal) *
                    1000,
            ) / 1000;

        if (offered > total)
            throw new ForbiddenException("Porcentagem insuficiente de posse");

        const offer = this.offerRepository.create(data);

        offer.ownership = ownership;

        return await this.offerRepository.save(offer);
    }
}
