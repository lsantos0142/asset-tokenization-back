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
import { SeizeCollateralDto } from "../dto/seize-collateral.dto";
import { CollateralService } from "./collateral.service";

@Controller("tokenized-asset/collateral")
@ApiTags("Tokenized Assets / Collateral")
export class CollateralController {
    constructor(private readonly collateralService: CollateralService) {}

    @Get("get-by-user/:id")
    getCollateralByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.getCollateralByUser(id);
    }

    @Get("get-by-bank/:id")
    getCollateralByBank(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.getCollateralByBank(id);
    }

    @Post("create")
    createCollateral(@Body() data: CreateCollateralDto) {
        return this.collateralService.createCollateral(data);
    }

    @Delete("delete/:id")
    deleteCollateral(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body() data: DeleteCollateralDto,
    ) {
        return this.collateralService.deleteCollateral(id, data);
    }

    @Put("seize/:id")
    seizeCollateral(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body() data: SeizeCollateralDto,
    ) {
        return this.collateralService.seizeCollateral(id, data);
    }
}
