import { AutoMap } from "@automapper/classes";
import { TokenizedAssetResponseDto } from "src/tokenized-asset/dto/tokenized-asset-response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";

export class OwnershipResponseDto {
    @AutoMap()
    public id: string;

    @AutoMap()
    public isEffectiveOwner: boolean;

    @AutoMap()
    public percentageOwned: number;

    public availablePercentage: number;

    // @AutoMap()
    // public collaterals: CollateralResponseDto[];

    // @AutoMap()
    // public offers: OfferResponseDto[];

    // @AutoMap()
    // public rentPayments: RentPaymentResponseDto[];

    @AutoMap(() => UserResponseDto)
    public user: UserResponseDto;

    @AutoMap(() => TokenizedAssetResponseDto)
    public tokenizedAsset: TokenizedAssetResponseDto;
}
