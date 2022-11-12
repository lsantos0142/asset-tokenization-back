import { CreateTokenizedAssetDto } from "../../dto/create-tokenized-asset.dto";
import { TokenizationProposal } from "../../entities/tokenization-proposal.entity";

export class CreateOwnershipDto {
    isEffectiveOwner: boolean;
    percentageOwned: number;
    tokenizedAsset: CreateTokenizedAssetDto;
    tokenizationProposal: TokenizationProposal;
}
