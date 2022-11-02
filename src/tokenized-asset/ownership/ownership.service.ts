import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { UpsertOwnershipDto } from "../dto/upsert-ownership.dto";
import { Ownership } from "../entities/ownership.entity";
import { TokenizedAsset } from "../entities/tokenized-asset.entity";

@Injectable()
export class OwnershipService {
    constructor(
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        @InjectRepository(TokenizedAsset)
        private assetRepository: Repository<TokenizedAsset>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

    async getAllOwnershipsByAsset(id: string) {
        const asset = await this.assetRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["ownerships"],
        });

        return asset.ownerships;
    }

    async getEffectiveOwnerByAsset(id: string) {
        const asset = await this.assetRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["ownerships", "ownerships.user"],
        });

        return asset.ownerships.find((o) => o.isEffectiveOwner);
    }

    async getOwnershipsByUser(userId: string) {
        const ownerships = this.ownershipRepository
            .createQueryBuilder("ownership")
            .innerJoinAndSelect("ownership.tokenizedAsset", "tokenizedAsset")
            .innerJoinAndSelect("ownership.user", "user")
            .where("user.id = :id", { id: userId })
            .getMany();

        return ownerships;
    }

    async upsertOwnershipFromTransfer({
        buyerUserId,
        contractAddress,
        isEffectiveOwnerTransfer,
        sellerUserId,
        transferShares,
    }: UpsertOwnershipDto) {
        const seller = await this.usersService.findUserByQuery({
            where: {
                id: sellerUserId,
            },
            relations: ["ownerships", "ownerships.tokenizedAsset"],
        });

        const sellerOwnership = seller.ownerships.find(
            (o) => o.tokenizedAsset.contractAddress === contractAddress,
        );

        if (!seller.walletAddress)
            throw new ForbiddenException(
                "Seller doesn't have wallet connected",
            );

        if (!sellerOwnership)
            throw new ForbiddenException("Seller isn't owner of asset");

        if (isEffectiveOwnerTransfer && !sellerOwnership.isEffectiveOwner)
            throw new ForbiddenException("Seller isn't effective owner");

        if (sellerOwnership.percentageOwned < transferShares)
            throw new ForbiddenException("Insuficient seller shares");

        const buyer = await this.usersService.findUserByQuery({
            where: {
                id: buyerUserId,
            },
            relations: ["ownerships", "ownerships.tokenizedAsset"],
        });

        if (!buyer.walletAddress)
            throw new ForbiddenException("Buyer doesn't have wallet connected");

        let buyerOwnership = buyer.ownerships.find(
            (o) => o.tokenizedAsset.contractAddress === contractAddress,
        );

        await this.smartContractsService.transferOwnership({
            buyer: buyer.walletAddress,
            seller: seller.walletAddress,
            contractAddress: contractAddress,
            isEffectiveOwnerTransfer: isEffectiveOwnerTransfer,
            transferShares: Math.round(transferShares * 1000),
        });

        if (!!buyerOwnership) {
            buyerOwnership.percentageOwned =
                Math.round(
                    (Number(buyerOwnership.percentageOwned) +
                        Number(transferShares)) *
                        1000,
                ) / 1000;
            buyerOwnership.isEffectiveOwner =
                buyerOwnership.isEffectiveOwner || isEffectiveOwnerTransfer;
        } else {
            buyerOwnership = this.ownershipRepository.create({
                isEffectiveOwner: isEffectiveOwnerTransfer,
                percentageOwned: Math.round(transferShares * 1000) / 1000,
            });

            buyerOwnership.user = buyer;
            buyerOwnership.tokenizedAsset = sellerOwnership.tokenizedAsset;
        }

        sellerOwnership.isEffectiveOwner =
            sellerOwnership.isEffectiveOwner && !isEffectiveOwnerTransfer;
        sellerOwnership.percentageOwned =
            Math.round(
                (sellerOwnership.percentageOwned - transferShares) * 1000,
            ) / 1000;

        await this.ownershipRepository.save(buyerOwnership);
        if (
            !sellerOwnership.isEffectiveOwner &&
            sellerOwnership.percentageOwned === 0
        ) {
            await this.ownershipRepository.softDelete({
                id: sellerOwnership.id,
            });
        } else {
            await this.ownershipRepository.save(sellerOwnership);
        }

        return buyerOwnership;
    }
}
