import { IsNotEmpty } from "class-validator";

export class CreateRentPaymentsDto {
    @IsNotEmpty()
    tokenizedAssetId: string;
    @IsNotEmpty()
    amount: number;
}
