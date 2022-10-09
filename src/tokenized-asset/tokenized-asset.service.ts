import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Not, Repository } from "typeorm";
import { CreateOwnershipDto } from "./dto/create-ownership.dto";
import { CreateTokenizationProposalDto } from "./dto/create-tokenization-proposal.dto";
import { UpsertOwnershipDto } from "./dto/upsert-ownership.dto";
import { Ownership } from "./entities/ownership.entity";
import {
    ProposalStatus,
    TokenizationProposal,
} from "./entities/tokenization-proposal.entity";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";

@Injectable()
export class TokenizedAssetService {
    constructor(
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        @InjectRepository(TokenizedAsset)
        private tokenizedAssetRepository: Repository<TokenizedAsset>,
        @InjectRepository(TokenizationProposal)
        private proposalRepository: Repository<TokenizationProposal>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

    async createFirstOwnership(data: CreateOwnershipDto) {
        const ownership = this.ownershipRepository.create(data);
        const tokenizedAsset = this.tokenizedAssetRepository.create(
            data.tokenizedAsset,
        );
        const loggedUser = await this.usersService.find(
            data.tokenizationProposal.user.id,
        );

        tokenizedAsset.tokenizationProposal = data.tokenizationProposal;

        ownership.user = loggedUser;
        ownership.tokenizedAsset = tokenizedAsset;

        await this.tokenizedAssetRepository.save(tokenizedAsset);
        const savedOwnership = await this.ownershipRepository.save(ownership);

        return savedOwnership;
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

    async createTokenizationProposal(data: CreateTokenizationProposalDto) {
        const existingProposal = await this.proposalRepository.findOne({
            where: {
                registration: data.registration,
                status: Not(ProposalStatus.REFUSED.toString()),
            },
        });

        if (!!existingProposal)
            throw new ForbiddenException(
                "Proposal with given registration already active on platform",
            );

        const user = await this.usersService.findOneOrFail({ id: data.userId });
        if (!user.walletAddress)
            throw new ForbiddenException("User doesn't have wallet");

        const proposal = this.proposalRepository.create(data);
        proposal.user = user;

        return await this.proposalRepository.save(proposal);
    }

    async getAllPendingProposal() {
        return await this.proposalRepository.find({
            where: { status: "0" },
        });
    }

    async refuseProposal(id: number) {
        const proposal = await this.proposalRepository.findOneByOrFail({
            id,
        });

        proposal.status = ProposalStatus.REFUSED.toString();
        await this.proposalRepository.save(proposal);
        return proposal;
    }

    async acceptProposal(id: number) {
        const proposal = await this.proposalRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["user"],
        });

        if (proposal.status.toString() !== ProposalStatus.PENDING.toString())
            throw new ForbiddenException("Proposal must be PENDING");

        proposal.status = ProposalStatus.APPROVED.toString();
        await this.proposalRepository.save(proposal);

        const contractAdress =
            await this.smartContractsService.createTokenization({
                proposal,
            });

        const createOwnershipData: CreateOwnershipDto = {
            isEffectiveOwner: true,
            percentageOwned: 1,
            tokenizedAsset: {
                usableArea: proposal.usableArea,
                registration: proposal.registration,
                contractAddress: contractAdress,
                address: proposal.address,
                deed: proposal.deed,
            },
            tokenizationProposal: proposal,
        };

        return await this.createFirstOwnership(createOwnershipData);
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
