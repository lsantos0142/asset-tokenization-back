import { IsNotEmpty, Matches } from "class-validator";
import { MessagesHelper } from "src/helpers/messages.helper";
import { RegExHelper } from "src/helpers/regex.helper";

export class CreateUserDto {
    @IsNotEmpty({ message: "O campo de nome é obrigatório" })
    name: string;

    @IsNotEmpty({ message: "O campo de usuário é obrigatório" })
    username: string;

    @IsNotEmpty({ message: "O campo de cpf é obrigatório" })
    cpf: string;

    @IsNotEmpty({ message: "A senha é obrigatória" })
    @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
    password: string;
}
