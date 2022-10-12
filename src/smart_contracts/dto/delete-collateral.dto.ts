import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class DeleteCollateralDto {
    @IsString()
    @IsNotEmpty()
    ownerWallet: string;
    @IsString()
    @IsNotEmpty()
    bankWallet: string;
    @IsNumber()
    @IsNotEmpty()
    collateralShares: number;
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    expirationDate: number;
    @IsString()
    @IsNotEmpty()
    contractAddress: string;
}
