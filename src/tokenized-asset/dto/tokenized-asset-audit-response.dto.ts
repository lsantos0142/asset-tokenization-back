import { UserResponseDto } from "src/users/dto/user-response.dto";

export class TokenizedAssetAuditResponseDto {
    owner: UserResponseDto;
    shares: number;
    rentPayments: any;
    collaterals: any;
}
