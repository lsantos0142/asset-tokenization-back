import { Module } from "@nestjs/common";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
import { UsersModule } from "src/users/users.module";
import { CollateralModule } from "./collateral/collateral.module";
import { OfferModule } from "./offer/offer.module";
import { OwnershipModule } from "./ownership/ownership.module";
import { ProposalModule } from "./proposal/proposal.module";
import { RentPaymentModule } from "./rent-payment/rent-payment.module";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
    imports: [
        ProposalModule,
        OwnershipModule,
        CollateralModule,
        OfferModule,
        RentPaymentModule,
        SmartContractsModule,
        UsersModule,
    ],
    controllers: [TokenizedAssetController],
    providers: [TokenizedAssetService],
    exports: [TokenizedAssetService],
})
export class TokenizedAssetModule {}
