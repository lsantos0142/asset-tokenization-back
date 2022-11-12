import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpsertOwnershipDto {
    @IsNumber()
    @IsNotEmpty()
    transferShares: number;
    @IsString()
    @IsNotEmpty()
    sellerUserId: string;
    @IsString()
    @IsNotEmpty()
    buyerUserId: string;
    @IsBoolean()
    @IsNotEmpty()
    isEffectiveOwnerTransfer: boolean;
    @IsString()
    @IsNotEmpty()
    contractAddress: string;
}
