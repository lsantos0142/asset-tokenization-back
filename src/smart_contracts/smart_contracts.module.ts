import { Module } from "@nestjs/common";
import { SmartContractsController } from "./smart_contracts.controller";
import { SmartContractsService } from "./smart_contracts.service";

@Module({
    controllers: [SmartContractsController],
    providers: [SmartContractsService],
    imports: [],
    exports: [SmartContractsService],
})
export class SmartContractsModule {}
