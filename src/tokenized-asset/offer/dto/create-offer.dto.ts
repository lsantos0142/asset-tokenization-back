import { IsNotEmpty } from "class-validator";

export class CreateOfferDto {
    @IsNotEmpty()
    percentage: number;
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    isEffectiveTransfer: boolean;
    @IsNotEmpty()
    ownershipId: string;
}
