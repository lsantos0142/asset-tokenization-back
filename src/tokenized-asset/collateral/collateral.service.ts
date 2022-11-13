import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SmartContractsService } from "src/smart_contracts/smart_contracts.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Collateral, CollateralStatus } from "../entities/collateral.entity";
import { OwnershipService } from "../ownership/ownership.service";
import { CreateCollateralDto } from "./dto/create-collateral.dto";
import { DeleteCollateralDto } from "./dto/delete-collateral.dto";
import { SeizeCollateralDto } from "./dto/seize-collateral.dto";

@Injectable()
export class CollateralService {
    constructor(
        @InjectRepository(Collateral)
        private collateralRepository: Repository<Collateral>,
        private readonly usersService: UsersService,
        private readonly smartContractsService: SmartContractsService,
        private readonly ownershipService: OwnershipService,
    ) {}

    async getCollateralByUser(id: string) {
        return await this.collateralRepository.find({
            where: {
                ownership: {
                    user: {
                        id: id,
                    },
                },
            },
            relations: ["ownership", "ownership.tokenizedAsset"],
        });
    }

    async getCollateralByBank(id: string) {
        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: { id },
                select: ["walletAddress"],
            });

        if (!bankWallet)
            throw new ForbiddenException("Bank doesn't have wallet connected");

        return await this.collateralRepository.find({
            where: { bankWallet },
            relations: ["ownership", "ownership.tokenizedAsset"],
        });
    }

    async createCollateral({
        bankUserId,
        sellerUserId,
        collateralShares,
        expirationDateISOString,
        contractAddress,
    }: CreateCollateralDto) {
        const expirationDate = new Date(expirationDateISOString);

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
            throw new ForbiddenException("Nenhuma carteira conectada");

        if (!sellerOwnership)
            throw new ForbiddenException("Não é dono do ativo");

        const sellerCollateralTotal = sellerOwnership.collaterals
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        if (
            collateralShares >
            sellerOwnership.percentageOwned - sellerCollateralTotal
        )
            throw new ForbiddenException("Porcentagem insuficiente de posse");

        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: {
                    id: bankUserId,
                },
            });

        if (!bankWallet)
            throw new ForbiddenException("Banco não possui carteira conectada");

        const bankCollateral = this.collateralRepository.create({
            bankWallet: bankWallet,
            percentage: collateralShares,
            expirationDate: expirationDateISOString,
            status: CollateralStatus.PENDING_CONFIRMATION.toString(),
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
        const expirationDate = new Date(expirationDateISOString);

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

        const collateral = ownerOwnership.collaterals.find(
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

    async seizeCollateral(collateralId: string, data: SeizeCollateralDto) {
        const collateral = await this.collateralRepository.findOne({
            where: { id: collateralId },
        });

        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: { id: data.bankUserId },
                select: ["walletAddress"],
            });

        if (!bankWallet)
            throw new ForbiddenException("Bank doesn't have wallet connected");

        if (bankWallet !== collateral.bankWallet)
            throw new ForbiddenException(
                "Bank provided not associated with collateral",
            );

        if (new Date(collateral.expirationDate) > new Date())
            throw new ForbiddenException("Expiration date not reached yet");

        await this.deleteCollateral(data);

        await this.ownershipService.upsertOwnershipFromTransfer({
            buyerUserId: data.bankUserId,
            contractAddress: data.contractAddress,
            isEffectiveOwnerTransfer: data.isOwnershipTransfer,
            sellerUserId: data.ownerUserId,
            transferShares: data.collateralShares,
        });

        return collateral;
    }

    async rejectCollateral(id: string) {}

    async validateCollateral(id: string) {
        // await this.smartContractsService.createCollateral({
        //     bankWallet: bankWallet,
        //     sellerWallet: seller.walletAddress,
        //     collateralShares: Math.round(collateralShares * 1000),
        //     expirationDate: Math.round(expirationDate.getTime() / 1000),
        //     contractAddress: contractAddress,
        // });
    }
}
