import { IsNotEmpty } from "class-validator";

export class CreateOfferDto {
    @IsNotEmpty()
    percentage: number;
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    ownershipId: string;
}
