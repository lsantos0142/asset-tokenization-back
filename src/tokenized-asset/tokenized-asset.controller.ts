import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Controller("tokenized-asset")
@ApiTags("Tokenized Assets")
export class TokenizedAssetController {
    constructor(
        private readonly tokenizedAssetService: TokenizedAssetService,
    ) {}

    @Get("get-all")
    async getAllOffers() {
        return await this.tokenizedAssetService.getAll();
    }

    @Get("audit/:contractAddress")
    async auditAssetData(@Param("contractAddress") contractAddress: string) {
        return await this.tokenizedAssetService.auditAssetData(contractAddress);
    }
}
