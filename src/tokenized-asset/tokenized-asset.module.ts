import { Module } from "@nestjs/common";
import { OwnershipModule } from "./ownership/ownership.module";
import { ProposalModule } from "./proposal/proposal.module";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Module({
    imports: [ProposalModule, OwnershipModule],
    controllers: [TokenizedAssetController],
    providers: [TokenizedAssetService],
    exports: [TokenizedAssetService],
})
export class TokenizedAssetModule {}
