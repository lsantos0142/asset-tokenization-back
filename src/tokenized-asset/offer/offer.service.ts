import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "../entities/offer.entity";
import { Ownership } from "../entities/ownership.entity";
import { CreateOfferDto } from "./dto/create-offer.dto";

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(Ownership)
        private ownershipRepository: Repository<Ownership>,
    ) {}

    async getOffersByOwnership(ownershipId: string) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: ownershipId,
            },
            relations: ["offers"],
        });

        return ownership.offers;
    }

    async createOffer(data: CreateOfferDto) {
        const ownership = await this.ownershipRepository.findOneOrFail({
            where: {
                id: data.ownershipId,
            },
            relations: ["offers"],
        });

        if (data.percentage === 0)
            throw new ForbiddenException("Cannot offer zero percentage");

        if (
            ownership.offers
                .map((o) => o.percentage)
                .reduce((sum, current) => Number(sum) + Number(current), 0) +
                data.percentage >
            ownership.percentageOwned
        )
            throw new ForbiddenException("Not enough percentage to offer");

        const offer = this.offerRepository.create(data);

        offer.ownership = ownership;

        return await this.offerRepository.save(offer);
    }
}
