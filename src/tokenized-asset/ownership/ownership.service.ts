import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { UpsertOwnershipDto } from "../dto/upsert-ownership.dto";
import { Ownership } from "../entities/ownership.entity";

@Injectable()
export class OwnershipService {
    constructor(
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

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
                Number(buyerOwnership.percentageOwned) + Number(transferShares);
            buyerOwnership.isEffectiveOwner = isEffectiveOwnerTransfer;
        } else {
            buyerOwnership = this.ownershipRepository.create({
                isEffectiveOwner: isEffectiveOwnerTransfer,
                percentageOwned: transferShares,
            });

            buyerOwnership.user = buyer;
            buyerOwnership.tokenizedAsset = sellerOwnership.tokenizedAsset;
        }

        sellerOwnership.isEffectiveOwner = !isEffectiveOwnerTransfer;
        sellerOwnership.percentageOwned -= transferShares;

        await this.ownershipRepository.save(buyerOwnership);
        await this.ownershipRepository.save(sellerOwnership);

        return buyerOwnership;
    }
}
