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
import { CreateTokenizationProposalDto } from "./dto/create-tokenization-proposal.dto";
import { UpsertOwnershipDto } from "./dto/upsert-ownership.dto";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Controller("tokenized-asset")
@ApiTags("Tokenized Assets")
export class TokenizedAssetController {
    constructor(
        private readonly tokenizedAssetService: TokenizedAssetService,
    ) {}

    @Post("proposal/create")
    createTokenizationProposal(@Body() data: CreateTokenizationProposalDto) {
        return this.tokenizedAssetService.createTokenizationProposal(data);
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

    @Get("ownership/get-by-user/:id")
    getOwnershipsByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.tokenizedAssetService.getOwnershipsByUser(id);
    }

    @Post("ownership/transfer")
    upsertOwnershipFromTransfer(@Body() data: UpsertOwnershipDto) {
        return this.tokenizedAssetService.upsertOwnershipFromTransfer(data);
    }
}
