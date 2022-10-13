import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class SeizeCollateralDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    bankUserId: string;
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
