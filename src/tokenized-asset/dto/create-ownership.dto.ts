import { TokenizationProposal } from "../entities/tokenization-proposal.entity";
import { CreateTokenizedAssetDto } from "./create-tokenized-asset.dto";

export class CreateOwnershipDto {
    isEffectiveOwner: boolean;
    percentageOwned: number;
    tokenizedAsset: CreateTokenizedAssetDto;
    tokenizationProposal: TokenizationProposal;
}
