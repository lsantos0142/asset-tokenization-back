import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    walletAddress: string;
}
