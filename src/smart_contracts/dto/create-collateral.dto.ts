import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCollateralDto {
    @IsString()
    @IsNotEmpty()
    bankWallet: string;
    @IsString()
    @IsNotEmpty()
    sellerWallet: string;
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
