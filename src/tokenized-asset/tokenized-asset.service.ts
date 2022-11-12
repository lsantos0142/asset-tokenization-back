import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { TokenizedAsset } from "./entities/tokenized-asset.entity";

@Injectable()
export class TokenizedAssetService {
    constructor(
        @InjectRepository(TokenizedAsset)
        private assetRepository: Repository<TokenizedAsset>,
        private readonly smartContractsService: SmartContractsService,
        private readonly userService: UsersService,
    ) {}

    async getAll() {
        return await this.assetRepository.find();
    }

    async auditAssetData(contractAddress: string) {
        const ownersData =
            this.smartContractsService.getAllOwnersDetails(contractAddress);
        const temp = this.userService.findOneOrFail({ walletId: "" });
    }
}
