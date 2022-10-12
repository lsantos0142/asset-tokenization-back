import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Controller("tokenized-asset")
@ApiTags("Tokenized Assets")
export class TokenizedAssetController {
    constructor(
        private readonly tokenizedAssetService: TokenizedAssetService,
    ) {}
}
