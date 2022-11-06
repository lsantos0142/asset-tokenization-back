import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterRentPaymentsDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;
    @IsDate()
    @IsNotEmpty()
    paymentDate: Date;
    @IsString()
    @IsNotEmpty()
    contractAddress: string;
}
