import { Module } from "@nestjs/common";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
  controllers: [TokenizedAssetController],
  providers: [TokenizedAssetService],
})
export class TokenizedAssetModule {}
