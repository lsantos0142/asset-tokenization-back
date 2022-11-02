import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Not, Repository } from "typeorm";
import { CreateOwnershipDto } from "../dto/create-ownership.dto";
import { CreateTokenizationProposalDto } from "../dto/create-tokenization-proposal.dto";
import { Ownership } from "../entities/ownership.entity";
import {
    ProposalStatus,
    TokenizationProposal,
} from "../entities/tokenization-proposal.entity";
import { TokenizedAsset } from "../entities/tokenized-asset.entity";

@Injectable()
export class ProposalService {
    constructor(
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        @InjectRepository(TokenizationProposal)
        private proposalRepository: Repository<TokenizationProposal>,
        @InjectRepository(TokenizedAsset)
        private tokenizedAssetRepository: Repository<TokenizedAsset>,
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

    async createTokenizationProposal(data: CreateTokenizationProposalDto) {
        const existingProposal = await this.proposalRepository.findOne({
            where: {
                registration: data.registration,
                status: Not(ProposalStatus.REFUSED.toString()),
            },
        });

        if (!!existingProposal)
            throw new ForbiddenException(
                "Imóvel com número de registro já existente na plataforma",
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
            relations: ["user"],
        });
    }

    async refuseProposal(id: string) {
        const proposal = await this.proposalRepository.findOneByOrFail({
            id,
        });

        proposal.status = ProposalStatus.REFUSED.toString();
        await this.proposalRepository.save(proposal);
        return proposal;
    }

    async acceptProposal(id: string) {
        const proposal = await this.proposalRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["user"],
        });

        if (proposal.status.toString() !== ProposalStatus.PENDING.toString())
            throw new ForbiddenException("Proposal must be PENDING");

        const contractAdress =
            await this.smartContractsService.createTokenization({
                proposal,
            });

        proposal.status = ProposalStatus.APPROVED.toString();
        await this.proposalRepository.save(proposal);

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
}
