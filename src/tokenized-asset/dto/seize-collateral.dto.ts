import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class SeizeCollateralDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    bankUserId: string;
}
