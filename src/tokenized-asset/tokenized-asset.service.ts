import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { TokenizedAssetAuditResponseDto } from "./dto/tokenized-asset-audit-response.dto";
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
        const ownersData: any[] =
            await this.smartContractsService.getAllOwnersDetails(
                contractAddress,
            );

        return Promise.all(
            ownersData?.map(async (od) => {
                const user = await this.userService.findOneOrFail({
                    walletAddress: od[1],
                });

                const rentPayments = od[3]?.map((rp) => {
                    return {
                        amount: rp[0] / 1000,
                        shares: rp[1] / 1000,
                        paymentDate: new Date(Number(rp[2])),
                    };
                });

                const collaterals = od[2]?.map((c) => {
                    return {
                        bankId: c[0],
                        collateralShares: c[1] / 1000,
                        expirationDate: new Date(Number(c[2])),
                    };
                });

                return {
                    owner: {
                        name: user.name,
                        username: user.username,
                        cpf: user.cpf,
                        walletAddress: user.walletAddress,
                        isAdmin: user.isAdmin,
                    },
                    shares: od[0] / 1000,
                    rentPayments: rentPayments,
                    collaterals: collaterals,
                } as TokenizedAssetAuditResponseDto;
            }),
        );
    }
}
