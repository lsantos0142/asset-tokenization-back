import { IsNotEmpty } from "class-validator";

export class AcceptOfferDto {
    @IsNotEmpty()
    userId: string;
    @IsNotEmpty()
    offerId: string;
}
