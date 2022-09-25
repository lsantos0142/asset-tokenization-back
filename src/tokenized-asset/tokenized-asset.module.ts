import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";
import { UserToTokenizedAsset } from "./entities/user-to-tokenized-asset.entity";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenizedAsset, UserToTokenizedAsset]),
    UsersModule,
  ],
  controllers: [TokenizedAssetController],
  providers: [TokenizedAssetService],
  exports: [TokenizedAssetService, TypeOrmModule],
})
export class TokenizedAssetModule {}
