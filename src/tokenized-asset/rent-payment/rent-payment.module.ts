import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
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
        SmartContractsModule,
        TypeOrmModule.forFeature([RentPayment, Ownership]),
    ],
})
export class RentPaymentModule {}
