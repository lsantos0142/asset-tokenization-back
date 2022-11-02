import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";

@Injectable()
export class TokenizedAssetService {
    constructor(
        @InjectRepository(TokenizedAsset)
        private assetRepository: Repository<TokenizedAsset>,
    ) {}

    async getAllOwnershipsByAsset(id: string) {
        const asset = await this.assetRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["ownerships"],
        });

        return asset.ownerships;
    }

    async getEffectiveOwnerByAsset(id: string) {
        const asset = await this.assetRepository.findOneOrFail({
            where: {
                id: id,
            },
            relations: ["ownerships", "ownerships.user"],
        });

        return asset.ownerships.find((o) => o.isEffectiveOwner);
    }
}
