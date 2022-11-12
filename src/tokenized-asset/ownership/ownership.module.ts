import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenizedAssetProfile } from "src/profiles/tokenized-asset-profile";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
import { UsersModule } from "src/users/users.module";
import { Ownership } from "../entities/ownership.entity";
import { TokenizedAsset } from "../entities/tokenized-asset.entity";
import { OwnershipController } from "./ownership.controller";
import { OwnershipService } from "./ownership.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ownership, TokenizedAsset]),
        UsersModule,
        SmartContractsModule,
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ],
    controllers: [OwnershipController],
    providers: [OwnershipService, TokenizedAssetProfile],
    exports: [OwnershipService],
})
export class OwnershipModule {}
