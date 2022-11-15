import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CollateralService } from "./collateral.service";
import { CreateCollateralDto } from "./dto/create-collateral.dto";
import { DeleteCollateralDto } from "./dto/delete-collateral.dto";
import { SeizeCollateralDto } from "./dto/seize-collateral.dto";

@Controller("tokenized-asset/collateral")
@ApiTags("Tokenized Assets / Collateral")
export class CollateralController {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly collateralService: CollateralService,
    ) {}

    @Get("get-by-user/:id")
    getCollateralByUser(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Query("status") status: string,
    ) {
        return this.collateralService.getCollateralByUser(id, status);
    }

    @Get("get-by-bank/:id")
    getCollateralByBank(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.getCollateralByBank(id);
    }

    @Post("create")
    createCollateral(@Body() data: CreateCollateralDto) {
        return this.collateralService.createCollateral(data);
    }

    @Put("reject/:id")
    rejectOfferPayment(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.rejectCollateral(id);
    }

    @Put("validate/:id")
    validateOfferPayment(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.validateCollateral(id);
    }

    @Put("register-loan-payment/:id")
    registerLoanPayment(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.collateralService.registerLoanPayment(id);
    }

    @Delete("delete")
    deleteCollateral(@Body() data: DeleteCollateralDto) {
        return this.collateralService.deleteCollateral(data);
    }

    @Put("seize/:id")
    seizeCollateral(
        @Param("id", new ParseUUIDPipe()) collateralId: string,
        @Body() data: SeizeCollateralDto,
    ) {
        return this.collateralService.seizeCollateral(collateralId, data);
    }

    @Get("get-all")
    async getAllCollaterals(@Query("status") status: string) {
        return this.collateralService.getAllCollateralsByStatus(status);
    }
}
