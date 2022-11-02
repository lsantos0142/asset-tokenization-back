import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ownership } from "../entities/ownership.entity";
import {
    RentPayment,
    RentPaymentStatus,
} from "../entities/rent-payment.entity";
import { OwnershipService } from "../ownership/ownership.service";
import { CreateRentPaymentsDto } from "./dto/create-rent-payment.dto";

@Injectable()
export class RentPaymentService {
    constructor(
        @InjectRepository(RentPayment)
        private rentPaymentRepository: Repository<RentPayment>,
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        private readonly ownershipService: OwnershipService,
    ) {}

    async getAllRentPaymentsByStatus(status: string) {
        const rentPayments = await this.rentPaymentRepository.find({
            where: {
                status: RentPaymentStatus[status],
            },
        });

        return rentPayments;
    }

    async createRentPayments(data: CreateRentPaymentsDto) {
        const ownerships = await this.ownershipService.getAllOwnershipsByAsset(
            data.tokenizedAssetId,
        );

        return ownerships.map(async (ownership) => {
            const createRentPayment = {
                amount: data.amount * ownership.percentageOwned,
                percentage: ownership.percentageOwned,
                paymentDate: new Date(),
            };

            const rentPayment =
                this.rentPaymentRepository.create(createRentPayment);

            rentPayment.ownership = ownership;

            await this.rentPaymentRepository.save(rentPayment);

            return rentPayment;
        });
    }

    async getRentPaymentsByOwnership(id: string) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["rentPayments"],
        });

        return ownership.rentPayments;
    }
}
