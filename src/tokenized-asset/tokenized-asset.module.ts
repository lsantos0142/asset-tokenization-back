import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Ownership } from "./entities/ownership.entity";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TokenizedAsset, Ownership]),
        UsersModule,
    ],
    controllers: [TokenizedAssetController],
    providers: [TokenizedAssetService],
    exports: [TokenizedAssetService, TypeOrmModule],
})
export class TokenizedAssetModule {}
