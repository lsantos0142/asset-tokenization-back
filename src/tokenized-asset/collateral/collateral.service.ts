import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CreateCollateralDto } from "../dto/create-collateral.dto";
import { DeleteCollateralDto } from "../dto/delete-collateral.dto";
import { Collateral } from "../entities/collateral.entity";

@Injectable()
export class CollateralService {
    constructor(
        @InjectRepository(Collateral)
        private collateralRepository: Repository<Collateral>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
    ) {}

    async getCollateralByUser(id: string) {
        return await this.collateralRepository
            .createQueryBuilder("collateral")
            .innerJoin("collateral.ownership", "ownership")
            .innerJoin("ownership.user", "user")
            .where("user.id = :id", { id })
            .select(["collateral"])
            .getMany();
    }

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

        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: {
                    id: bankUserId,
                },
            });

        if (!bankWallet)
            throw new ForbiddenException("Bank doesn't have wallet connected");

        await this.smartContractsService.createCollateral({
            bankWallet: bankWallet,
            sellerWallet: seller.walletAddress,
            collateralShares: Math.round(collateralShares * 1000),
            expirationDate: Math.round(expirationDate.getTime() / 1000),
            contractAddress: contractAddress,
        });

        let bankCollateral = this.collateralRepository.create({
            bankWallet: bankWallet,
            percentage: collateralShares,
            expirationDate: expirationDateISOString,
        });
        bankCollateral.ownership = sellerOwnership;

        return await this.collateralRepository.save(bankCollateral);
    }

    async deleteCollateral({
        bankUserId,
        ownerUserId,
        collateralShares,
        expirationDateISOString,
        contractAddress,
    }: DeleteCollateralDto) {
        let expirationDate = new Date(expirationDateISOString);

        const owner = await this.usersService.findUserByQuery({
            where: {
                id: ownerUserId,
            },
            relations: [
                "ownerships",
                "ownerships.tokenizedAsset",
                "ownerships.collaterals",
            ],
        });

        const ownerOwnership = owner.ownerships.find(
            (o) => o.tokenizedAsset.contractAddress === contractAddress,
        );

        if (!owner.walletAddress)
            throw new ForbiddenException("Owner doesn't have wallet connected");

        if (!ownerOwnership)
            throw new ForbiddenException("Owner isn't owner of asset");

        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: {
                    id: bankUserId,
                },
            });

        if (!bankWallet)
            throw new ForbiddenException("Bank doesn't have wallet connected");

        let collateral = ownerOwnership.collaterals.find(
            (c) =>
                c.bankWallet === bankWallet &&
                c.expirationDate === expirationDateISOString &&
                Number(c.percentage) === Number(collateralShares),
        );

        await this.smartContractsService.deleteCollateral({
            bankWallet: bankWallet,
            ownerWallet: owner.walletAddress,
            collateralShares: Math.round(collateralShares * 1000),
            expirationDate: Math.round(expirationDate.getTime() / 1000),
            contractAddress: contractAddress,
        });

        let response: any = [];

        if (!collateral) {
            throw new NotFoundException("Collateral not found");
        } else {
            response = await this.collateralRepository.softDelete({
                id: collateral.id,
            });

            return collateral;
        }
    }

    async seizeCollateral() {
        return await this.collateralRepository.find();
    }
}
