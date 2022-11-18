import { UserResponseDto } from "src/users/dto/user-response.dto";
import { CollateralAuditResponseDto } from "../collateral/dto/collateral-audit-response.dto";
import { RentPaymentAuditResponseDto } from "../rent-payment/dto/rent-payment-audit-response.dto";

export class TokenizedAssetAuditResponseDto {
    owner: UserResponseDto;
    shares: number;
    isEffectiveOwner: boolean;
    rentPayments: RentPaymentAuditResponseDto[];
    collaterals: CollateralAuditResponseDto[];
}
