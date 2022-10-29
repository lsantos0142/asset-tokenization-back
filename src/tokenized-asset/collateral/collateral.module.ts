import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
import { OwnershipModule } from "src/tokenized-asset/ownership/ownership.module";
import { UsersModule } from "src/users/users.module";
import { Collateral } from "../entities/collateral.entity";
import { CollateralController } from "./collateral.controller";
import { CollateralService } from "./collateral.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collateral]),
        UsersModule,
        SmartContractsModule,
        OwnershipModule,
    ],
    controllers: [CollateralController],
    providers: [CollateralService],
})
export class CollateralModule {}
