import { IsNotEmpty } from "class-validator";

export class CreateTokenizationProposalDto {
    @IsNotEmpty()
    effectiveOwner: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    usableArea: number;
    @IsNotEmpty()
    registration: string;
    @IsNotEmpty()
    deed: string;
    @IsNotEmpty()
    userId: string;
}
