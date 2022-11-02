import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ownership } from "../entities/ownership.entity";
import { RentPayment } from "../entities/rent-payment.entity";
import { OwnershipModule } from "../ownership/ownership.module";
import { RentPaymentController } from "./rent-payment.controller";
import { RentPaymentService } from "./rent-payment.service";

@Module({
    controllers: [RentPaymentController],
    providers: [RentPaymentService],
    imports: [
        OwnershipModule,
        TypeOrmModule.forFeature([RentPayment, Ownership]),
    ],
})
export class RentPaymentModule {}
