import { CreateTokenizedAssetDto } from "./create-tokenized-asset.dto";

export class CreateOwnershipDto {
    isEffectiveOwner: boolean;
    percentageOwned: number;
    tokenizedAsset: CreateTokenizedAssetDto;
}
