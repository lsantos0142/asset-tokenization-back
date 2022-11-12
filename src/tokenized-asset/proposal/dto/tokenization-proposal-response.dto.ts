import { AutoMap } from "@automapper/classes";
import { TokenizedAssetResponseDto } from "src/tokenized-asset/dto/tokenized-asset-response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";

export class TokenizationProposalResponseDto {
    @AutoMap()
    public id: string;

    @AutoMap()
    public address: string;

    @AutoMap()
    public registration: string;

    @AutoMap()
    public usableArea: number;

    @AutoMap()
    public status: string;

    @AutoMap()
    public tokenizedAsset: TokenizedAssetResponseDto;

    @AutoMap(() => UserResponseDto)
    public user: UserResponseDto;
}
