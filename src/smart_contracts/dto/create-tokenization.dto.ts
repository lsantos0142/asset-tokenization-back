import { IsNotEmpty } from "class-validator";
import { TokenizationProposal } from "src/tokenized-asset/entities/tokenization-proposal.entity";

export class CreateTokenizationDto {
    @IsNotEmpty()
    proposal: TokenizationProposal;
}
