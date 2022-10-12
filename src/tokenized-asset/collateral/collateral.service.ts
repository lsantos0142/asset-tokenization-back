import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CreateCollateralDto } from "../dto/create-collateral.dto";
import { Collateral } from "../entities/collateral.entity";

@Injectable()
export class CollateralService {
    constructor(
        @InjectRepository(Collateral)
        private collateralRepository: Repository<Collateral>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

    async createCollateral({
        bankUserId,
        sellerUserId,
        collateralShares,
        expirationDateISOString,
        contractAddress,
    }: CreateCollateralDto) {
        let expirationDate = new Date(expirationDateISOString);

        const seller = await this.usersService.findUserByQuery({
            where: {
                id: sellerUserId,
            },
            relations: [
                "ownerships",
                "ownerships.tokenizedAsset",
                "ownerships.collaterals",
            ],
        });

        const sellerOwnership = seller.ownerships.find(
            (o) => o.tokenizedAsset.contractAddress === contractAddress,
        );

        if (!seller.walletAddress)
            throw new ForbiddenException(
                "Seller doesn't have wallet connected",
            );

        if (!sellerOwnership)
            throw new ForbiddenException("Seller isn't owner of asset");

        const sellerCollateralTotal = sellerOwnership.collaterals
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        if (
            collateralShares >
            sellerOwnership.percentageOwned - sellerCollateralTotal
        )
            throw new ForbiddenException("Insuficient seller shares");

        const bank = await this.usersService.findUserByQuery({
            where: {
                id: bankUserId,
            },
            relations: ["ownerships", "ownerships.tokenizedAsset"],
        });

        if (!bank.walletAddress)
            throw new ForbiddenException("Buyer doesn't have wallet connected");

        await this.smartContractsService.createCollateral({
            bankWallet: bank.walletAddress,
            sellerWallet: seller.walletAddress,
            collateralShares: Math.round(collateralShares * 1000),
            expirationDate: Math.round(expirationDate.getTime() / 1000),
            contractAddress: contractAddress,
        });

        let bankCollateral = this.collateralRepository.create({
            bankWallet: bank.walletAddress,
            percentage: collateralShares,
            expirationDate: expirationDateISOString,
        });
        bankCollateral.ownership = sellerOwnership;

        return await this.collateralRepository.save(bankCollateral);
    }

    async deleteCollateral() {}

    async seizeCollateral() {
        return await this.collateralRepository.find();
    }
}
