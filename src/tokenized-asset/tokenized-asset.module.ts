import { Module } from "@nestjs/common";
import { CollateralModule } from "./collateral/collateral.module";
import { OfferModule } from "./offer/offer.module";
import { OwnershipModule } from "./ownership/ownership.module";
import { ProposalModule } from "./proposal/proposal.module";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
    imports: [ProposalModule, OwnershipModule, CollateralModule, OfferModule],
    controllers: [TokenizedAssetController],
    providers: [TokenizedAssetService],
    exports: [TokenizedAssetService],
})
export class TokenizedAssetModule {}
