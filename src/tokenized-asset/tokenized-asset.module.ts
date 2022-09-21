import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
  imports: [TypeOrmModule.forFeature([TokenizedAsset])],
  controllers: [TokenizedAssetController],
  providers: [TokenizedAssetService],
})
export class TokenizedAssetModule {}
