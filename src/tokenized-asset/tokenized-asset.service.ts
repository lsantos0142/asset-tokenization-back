import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CreateOwnershipDto } from "./dto/create-ownership.dto";
import { CreateTokenizationProposalDto } from "./dto/create-tokenization-proposal.dto";
import { Ownership } from "./entities/ownership.entity";
import { TokenizationProposal } from "./entities/tokenization-proposal.entity";
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

    async createTokenizationProposal(data: CreateTokenizationProposalDto) {
        const user = await this.usersService.findOneOrFail({ id: data.userId });
        if (!user.walletAddress)
            throw new ForbiddenException("User doesn't have wallet");

        const proposal = this.proposalRepository.create(data);
        proposal.user = user;

        return await this.proposalRepository.save(proposal);
    }

    async createOwnership(data: CreateOwnershipDto) {
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
        const savedUserToAsset = await this.ownershipRepository.save(ownership);

        return savedUserToAsset;
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

        proposal.status = "2";
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

        proposal.status = "1";
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

        return await this.createOwnership(createOwnershipData);
    }
}
