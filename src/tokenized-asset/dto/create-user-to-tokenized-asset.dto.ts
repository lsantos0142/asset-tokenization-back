import { CreateTokenizedAssetDto } from "./create-tokenized-asset.dto";

export class CreateUserToTokenizedAssetDto {
    isEffectiveOwner: boolean;
    percentageOwned: number;
    tokenizedAsset: CreateTokenizedAssetDto;
}
