import { AutoMap } from "@automapper/classes";
import { OwnershipResponseDto } from "../ownership/dto/ownership-response.dto";
import { TokenizationProposalResponseDto } from "../proposal/dto/tokenization-proposal-response.dto";

export class TokenizedAssetResponseDto {
    @AutoMap()
    public id: string;

    @AutoMap()
    public address: string;

    @AutoMap()
    public registration: string;

    @AutoMap()
    public usableArea: number;

    @AutoMap()
    public contractAddress: string;

    @AutoMap()
    public ownerships: OwnershipResponseDto[];

    @AutoMap(() => TokenizationProposalResponseDto)
    public tokenizationProposal: TokenizationProposalResponseDto;
}
