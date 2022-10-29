import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
import { UsersModule } from "src/users/users.module";
import { Ownership } from "../entities/ownership.entity";
import { OwnershipController } from "./ownership.controller";
import { OwnershipService } from "./ownership.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ownership]),
        UsersModule,
        SmartContractsModule,
    ],
    controllers: [OwnershipController],
    providers: [OwnershipService],
    exports: [OwnershipService],
})
export class OwnershipModule {}
