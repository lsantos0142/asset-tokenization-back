import { IsNotEmpty } from "class-validator";

export class UpsertOwnershipDto {
    @IsNotEmpty()
    transferShares: number;
    @IsNotEmpty()
    sellerUserId: string;
    @IsNotEmpty()
    buyerUserId: string;
    @IsNotEmpty()
    isEffectiveOwnerTransfer: boolean;
    @IsNotEmpty()
    contractAddress: string;
}
