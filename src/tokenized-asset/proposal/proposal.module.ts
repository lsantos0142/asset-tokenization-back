import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenizedAssetProfile } from "src/profiles/tokenized-asset-profile";
import { SmartContractsModule } from "src/smart_contracts/smart_contracts.module";
import { UsersModule } from "src/users/users.module";
import { Ownership } from "../entities/ownership.entity";
import { TokenizationProposal } from "../entities/tokenization-proposal.entity";
import { TokenizedAsset } from "../entities/tokenized-asset.entity";
import { ProposalController } from "./proposal.controller";
import { ProposalService } from "./proposal.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TokenizedAsset,
            Ownership,
            TokenizationProposal,
        ]),
        UsersModule,
        SmartContractsModule,
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ],
    controllers: [ProposalController],
    providers: [ProposalService, TokenizedAssetProfile],
    exports: [TypeOrmModule],
})
export class ProposalModule {}
