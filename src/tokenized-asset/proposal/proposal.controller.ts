import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Ownership } from "../entities/ownership.entity";
import { TokenizationProposal } from "../entities/tokenization-proposal.entity";
import { OwnershipResponseDto } from "../ownership/dto/ownership-response.dto";
import { CreateTokenizationProposalDto } from "./dto/create-tokenization-proposal.dto";
import { TokenizationProposalResponseDto } from "./dto/tokenization-proposal-response.dto";
import { ProposalService } from "./proposal.service";

@Controller("tokenized-asset/proposal")
@ApiTags("Tokenized Assets / Proposal")
export class ProposalController {
    constructor(
        private readonly proposalService: ProposalService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @Post("create")
    async createTokenizationProposal(
        @Body() data: CreateTokenizationProposalDto,
    ) {
        return this.mapper.mapAsync(
            await this.proposalService.createTokenizationProposal(data),
            TokenizationProposal,
            TokenizationProposalResponseDto,
        );
    }

    @Get("get-pending")
    async getAllPendingProposal() {
        return this.mapper.mapArrayAsync(
            await this.proposalService.getAllPendingProposal(),
            TokenizationProposal,
            TokenizationProposalResponseDto,
        );
    }

    @Put("refuse/:id")
    async refuseProposal(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.mapper.mapAsync(
            await this.proposalService.refuseProposal(id),
            TokenizationProposal,
            TokenizationProposalResponseDto,
        );
    }

    @Put("accept/:id")
    async acceptProposal(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.mapper.mapAsync(
            await this.proposalService.acceptProposal(id),
            Ownership,
            OwnershipResponseDto,
        );
    }
}
