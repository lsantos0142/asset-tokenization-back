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
import { OfferStatus } from "../entities/offer.entity";
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

    async getCollateralByUser(id: string, status: string) {
        return await this.collateralRepository.find({
            where: {
                ownership: {
                    user: {
                        id: id,
                    },
                },
                status: CollateralStatus[status],
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
                "ownerships.offers",
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
            .filter(
                (c) =>
                    c.status.toString() ===
                        CollateralStatus.ACTIVE.toString() ||
                    c.status.toString() ===
                        CollateralStatus.PENDING_CONFIRMATION.toString(),
            )
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        const sellerOfferTotal = sellerOwnership.offers
            .filter(
                (o) =>
                    o.status.toString() === OfferStatus.AVAILABLE.toString() ||
                    o.status.toString() ===
                        OfferStatus.WAITING_PAYMENT.toString(),
            )
            .map((c) => c.percentage)
            .reduce((c, total) => Number(total) + Number(c), 0);

        collateralShares = Math.round(collateralShares * 1000) / 1000;
        let total =
            Math.round(
                (sellerOwnership.percentageOwned -
                    sellerCollateralTotal -
                    sellerOfferTotal) *
                    1000,
            ) / 1000;

        if (collateralShares > total)
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
            throw new ForbiddenException("Dono não possui carteira conectada");

        if (!ownerOwnership)
            throw new ForbiddenException("Não é dono do ativo");

        const { walletAddress: bankWallet } =
            await this.usersService.findUserByQuery({
                where: {
                    id: bankUserId,
                },
            });

        if (!bankWallet)
            throw new ForbiddenException("Banco não possui carteira conectada");

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
            throw new NotFoundException("Empréstimo não encontrado");
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

    async rejectCollateral(id: string) {
        const collateral = await this.collateralRepository.findOne({
            where: { id: id },
        });

        if (!collateral) throw new ForbiddenException("Empréstimo não existe");

        if (
            collateral.status.toString() !==
            CollateralStatus.PENDING_CONFIRMATION.toString()
        )
            throw new ForbiddenException(
                "Empréstimo deve estar com confirmação pendente",
            );

        collateral.status = CollateralStatus.CANCELED.toString();
        await this.collateralRepository.save(collateral);

        return collateral;
    }

    async validateCollateral(id: string) {
        const collateral = await this.collateralRepository.findOne({
            where: { id: id },
            relations: [
                "ownership",
                "ownership.user",
                "ownership.tokenizedAsset",
            ],
        });

        if (!collateral) throw new ForbiddenException("Empréstimo não existe");

        if (
            collateral.status.toString() !==
            CollateralStatus.PENDING_CONFIRMATION.toString()
        )
            throw new ForbiddenException(
                "Empréstimo deve estar com confirmação pendente",
            );

        delete collateral.ownership.user.updatedAt;
        delete collateral.ownership.user.createdAt;
        delete collateral.ownership.user.deletedAt;
        delete collateral.ownership.user.password; // mapper pra que? kkk
        delete collateral.ownership.user.hashedRt;

        collateral.status = CollateralStatus.ACTIVE.toString();

        await this.smartContractsService.createCollateral({
            bankWallet: collateral.bankWallet,
            sellerWallet: collateral.ownership.user.walletAddress,
            collateralShares: Math.round(collateral.percentage * 1000),
            expirationDate: Math.round(
                new Date(collateral.expirationDate).getTime() / 1000,
            ),
            contractAddress:
                collateral.ownership.tokenizedAsset.contractAddress,
        });

        await this.collateralRepository.save(collateral);

        return collateral;
    }

    async getAllCollateralsByStatus(status: string) {
        let collaterals = await this.collateralRepository.find({
            where: {
                status: CollateralStatus[status],
            },
            relations: [
                "ownership",
                "ownership.tokenizedAsset",
                "ownership.user",
            ],
        });

        collaterals = collaterals.map((collateral) => {
            delete collateral.ownership.user.updatedAt;
            delete collateral.ownership.user.createdAt;
            delete collateral.ownership.user.deletedAt;
            delete collateral.ownership.user.password; // mapper pra que? kkk
            delete collateral.ownership.user.hashedRt;

            return collateral;
        });

        const wallets = collaterals.map((collateral) => {
            return collateral.bankWallet;
        });

        const banks = await Promise.all(
            wallets.map(async (wallet) => {
                const bank = await this.usersService.findUserByQuery({
                    where: {
                        walletAddress: wallet,
                    },
                });

                delete bank.updatedAt;
                delete bank.createdAt;
                delete bank.deletedAt;
                delete bank.password; // mapper pra que? kkk
                delete bank.hashedRt;

                return bank;
            }),
        );

        const response = collaterals.map((collateral, index) => {
            return { ...collateral, bank: banks[index] };
        });

        return response;
    }

    async registerLoanPayment(id: string) {
        const collateral = await this.collateralRepository.findOne({
            where: { id: id },
        });

        if (!collateral) throw new ForbiddenException("Empréstimo não existe");

        if (collateral.status.toString() !== CollateralStatus.ACTIVE.toString())
            throw new ForbiddenException("Empréstimo deve estar ativo");

        collateral.status =
            CollateralStatus.AWAITING_LOAN_PAYMENT_VALIDATION.toString();
        await this.collateralRepository.save(collateral);

        return collateral;
    }
}
