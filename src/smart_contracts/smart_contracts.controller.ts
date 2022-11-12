import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTokenizationDto } from "./dto/create-tokenization.dto";
import { SmartContractsService } from "./smart_contracts.service";

@Controller("smart-contracts")
@ApiTags("Smart Contracts")
export class SmartContractsController {
    constructor(
        private readonly smartContractsService: SmartContractsService,
    ) {}

    @Post("create")
    createTokenization(@Body() createTokenizationDto: CreateTokenizationDto) {
        return this.smartContractsService.createTokenization(
            createTokenizationDto,
        );
    }

    @Get("methods")
    testMethods() {
        return this.smartContractsService.getAllOwnersDetails("");
    }
}
