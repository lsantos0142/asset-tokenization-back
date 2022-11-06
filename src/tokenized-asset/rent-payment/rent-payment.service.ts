import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { Repository } from "typeorm";
import { Ownership } from "../entities/ownership.entity";
import { RentPayment } from "../entities/rent-payment.entity";
import { OwnershipService } from "../ownership/ownership.service";
import { CreateRentPaymentDto } from "./dto/create-rent-payment.dto";

@Injectable()
export class RentPaymentService {
    constructor(
        @InjectRepository(RentPayment)
        private rentPaymentRepository: Repository<RentPayment>,
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
        private readonly ownershipService: OwnershipService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

    async createRentPayment(data: CreateRentPaymentDto) {
        const ownerships = await this.ownershipService.getAllOwnershipsByAsset(
            data.tokenizedAssetId,
        );

        await this.smartContractsService.registerRentPayment({
            amount: data.amount,
            paymentDate: new Date(),
            contractAddress: data.contractAddress,
        });

        return Promise.all(
            ownerships.map(async (ownership) => {
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
            }),
        );
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
