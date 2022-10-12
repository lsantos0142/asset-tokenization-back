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
import { CreateTokenizationProposalDto } from "../dto/create-tokenization-proposal.dto";
import { ProposalService } from "./proposal.service";

@Controller("tokenized-asset/proposal")
@ApiTags("Tokenized Assets / Proposal")
export class ProposalController {
    constructor(private readonly proposalService: ProposalService) {}

    @Post("create")
    createTokenizationProposal(@Body() data: CreateTokenizationProposalDto) {
        return this.proposalService.createTokenizationProposal(data);
    }

    @Get("get-pending")
    getAllPendingProposal() {
        return this.proposalService.getAllPendingProposal();
    }

    @Put("refuse/:id")
    refuseProposal(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.proposalService.refuseProposal(id);
    }

    @Put("accept/:id")
    acceptProposal(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.proposalService.acceptProposal(id);
    }
}
