import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class DeleteCollateralDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    ownerUserId: string;
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
