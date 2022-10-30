import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Offer } from "../entities/offer.entity";
import { Ownership } from "../entities/ownership.entity";
import { OwnershipModule } from "../ownership/ownership.module";
import { OfferController } from "./offer.controller";
import { OfferService } from "./offer.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ownership, Offer]),
        OwnershipModule,
        UsersModule,
    ],
    controllers: [OfferController],
    providers: [OfferService],
})
export class OfferModule {}
