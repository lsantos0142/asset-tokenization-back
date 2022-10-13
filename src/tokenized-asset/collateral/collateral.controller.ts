import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateCollateralDto } from "../dto/create-collateral.dto";
import { DeleteCollateralDto } from "../dto/delete-collateral.dto";
import { CollateralService } from "./collateral.service";

@Controller("tokenized-asset/collateral")
@ApiTags("Tokenized Assets / Collateral")
export class CollateralController {
    constructor(private readonly collateralService: CollateralService) {}

    @Get("get-by-user/:id")
    getCollateralByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.getCollateralByUser(id);
    }

    @Post("create")
    createCollateral(@Body() data: CreateCollateralDto) {
        return this.collateralService.createCollateral(data);
    }

    @Delete("delete")
    deleteCollateral(@Body() data: DeleteCollateralDto) {
        return this.collateralService.deleteCollateral(data);
    }

    @Put("seize")
    seizeCollateral() {
        return this.collateralService.seizeCollateral();
    }
}
