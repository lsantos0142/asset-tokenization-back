import { IsNotEmpty } from "class-validator";

export class CreateRentPaymentDto {
    @IsNotEmpty()
    tokenizedAssetId: string;
    @IsNotEmpty()
    contractAddress: string;
    @IsNotEmpty()
    amount: number;
}
