import { PartialType } from "@nestjs/swagger";
import { CreateTokenizedAssetDto } from "./create-tokenized-asset.dto";

export class UpdateTokenizedAssetDto extends PartialType(
    CreateTokenizedAssetDto,
) {}
