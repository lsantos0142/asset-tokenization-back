import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
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
    ],
    controllers: [ProposalController],
    providers: [ProposalService],
    exports: [TypeOrmModule],
})
export class ProposalModule {}
