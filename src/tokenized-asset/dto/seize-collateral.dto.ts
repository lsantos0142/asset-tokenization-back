import { IsBoolean, IsNotEmpty } from "class-validator";
import { DeleteCollateralDto } from "./delete-collateral.dto";

export class SeizeCollateralDto extends DeleteCollateralDto {
    @IsBoolean()
    @IsNotEmpty()
    isOwnershipTransfer: boolean;
}
