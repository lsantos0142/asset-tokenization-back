import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Offer, OfferStatus } from "../entities/offer.entity";
import { Ownership } from "../entities/ownership.entity";
import { OwnershipService } from "../ownership/ownership.service";
import { AcceptOfferDto } from "./dto/accept-offer.dto";
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

    async getAllOffersByStatus(status: string) {
        const offers = await this.offerRepository.find({
            where: {
                status: OfferStatus[status],
            },
            relations: ["ownership", "ownership.tokenizedAsset"],
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

    async createOffer(data: CreateOfferDto) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: data.ownershipId,
            },
            relations: ["offers"],
        });

        if (data.isEffectiveTransfer && !ownership.isEffectiveOwner)
            throw new ForbiddenException("Seller isn't effective owner");

        if (
            data.isEffectiveTransfer &&
            ownership.offers.some((o) => o.isEffectiveTransfer)
        )
            throw new ForbiddenException(
                "Offer with effective transfer already exists for this ownership",
            );

        if (data.percentage === 0 && !data.isEffectiveTransfer)
            throw new ForbiddenException("Cannot offer zero percentage");

        if (
            ownership.offers
                .filter(
                    (o) =>
                        o.status.toString() ===
                        OfferStatus.AVAILABLE.toString(),
                )
                .map((o) => o.percentage)
                .reduce((sum, current) => Number(sum) + Number(current), 0) +
                data.percentage >
            ownership.percentageOwned
        )
            throw new ForbiddenException("Not enough percentage to offer");

        const offer = this.offerRepository.create(data);

        offer.ownership = ownership;

        return await this.offerRepository.save(offer);
    }
}
