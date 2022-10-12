import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCollateralDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    bankUserId: string;
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    sellerUserId: string;
    @IsNumber()
    @IsNotEmpty()
    collateralShares: number;
    @IsString()
    @IsNotEmpty()
    expirationDateISOString: string;
    @IsString()
    @IsNotEmpty()
    contractAddress: string;
}
