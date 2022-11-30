import { IsNotEmpty } from "class-validator";

export class AddReceiptDto {
    @IsNotEmpty()
    offerId: string;
    @IsNotEmpty()
    receipt: string;
}
