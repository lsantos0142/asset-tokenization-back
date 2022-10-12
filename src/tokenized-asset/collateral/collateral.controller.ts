import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CollateralService } from "./collateral.service";

@Controller("tokenized-asset/collateral")
@ApiTags("Tokenized Assets / Collateral")
export class CollateralController {
    constructor(private readonly collateralService: CollateralService) {}
}
