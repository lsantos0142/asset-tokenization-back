import { IsNotEmpty } from "class-validator";

export class CreateTokenizationDto {
    @IsNotEmpty()
    effectiveOwner: string;
    @IsNotEmpty()
    assetAddress: string;
    @IsNotEmpty()
    assetUsableArea: number;
    @IsNotEmpty()
    registration: string;
    @IsNotEmpty()
    userId: string;
}
