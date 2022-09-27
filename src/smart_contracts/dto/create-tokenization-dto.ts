import { IsNotEmpty } from "class-validator";

export class CreateTokenizationDto {
    @IsNotEmpty()
    effectiveOwner: string;
    @IsNotEmpty()
    assetAddress: string;
    @IsNotEmpty()
    assetUsableArea: number;
    @IsNotEmpty()
    assetId: number;
    @IsNotEmpty()
    userId: string;
}
