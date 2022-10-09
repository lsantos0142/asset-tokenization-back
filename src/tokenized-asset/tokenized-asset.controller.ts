import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTokenizationProposalDto } from "./dto/create-tokenization-proposal.dto";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Controller("tokenized-asset")
@ApiTags("Tokenized Assets")
export class TokenizedAssetController {
    constructor(
        private readonly tokenizedAssetService: TokenizedAssetService,
    ) {}

    @Post("proposal/create")
    createTokenizationProposal(
        @Body() createProposalDto: CreateTokenizationProposalDto,
    ) {
        return this.tokenizedAssetService.createTokenizationProposal(
            createProposalDto,
        );
    }

    @Get("proposal/get-pending")
    getAllPendingProposal() {
        return this.tokenizedAssetService.getAllPendingProposal();
    }

    @Put("proposal/refuse/:id")
    refuseProposal(@Param("id") id: string) {
        return this.tokenizedAssetService.refuseProposal(+id);
    }

    @Put("proposal/accept/:id")
    acceptProposal(@Param("id") id: string) {
        return this.tokenizedAssetService.acceptProposal(+id);
    }
}
