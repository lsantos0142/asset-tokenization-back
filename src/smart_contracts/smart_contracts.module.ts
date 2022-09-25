import { Module } from "@nestjs/common";
import { TokenizedAssetModule } from "src/tokenized-asset/tokenized-asset.module";
import { SmartContractsController } from "./smart_contracts.controller";
import { SmartContractsService } from "./smart_contracts.service";

@Module({
  controllers: [SmartContractsController],
  providers: [SmartContractsService],
  imports: [TokenizedAssetModule],
})
export class SmartContractsModule {}
