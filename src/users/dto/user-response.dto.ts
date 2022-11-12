import { AutoMap } from "@automapper/classes";

export class UserResponseDto {
    @AutoMap()
    id: string;

    @AutoMap()
    name: string;

    @AutoMap()
    username: string;

    @AutoMap()
    cpf: string;

    @AutoMap()
    walletAddress: string;

    @AutoMap()
    isAdmin: boolean;
}
