import { AutoMap } from "@automapper/classes";
import { OwnershipResponseDto } from "src/tokenized-asset/ownership/dto/ownership-response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";

export class OfferResponseDto {
    @AutoMap()
    public id: string;

    @AutoMap()
    public percentage: number;

    @AutoMap()
    public amount: number;

    @AutoMap()
    public isEffectiveTransfer: boolean;

    @AutoMap()
    public receipt: string;

    @AutoMap()
    public status: string;

    @AutoMap(() => OwnershipResponseDto)
    public ownership: OwnershipResponseDto;

    @AutoMap(() => UserResponseDto)
    public currentBuyer: UserResponseDto;
}
