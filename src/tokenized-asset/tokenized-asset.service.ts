import { Injectable } from "@nestjs/common";
import { CreateTokenizedAssetDto } from "./dto/create-tokenized-asset.dto";
import { UpdateTokenizedAssetDto } from "./dto/update-tokenized-asset.dto";

@Injectable()
export class TokenizedAssetService {
  create(createTokenizedAssetDto: CreateTokenizedAssetDto) {
    return "This action adds a new tokenizedAsset";
  }

  findAll() {
    return `This action returns all tokenizedAsset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tokenizedAsset`;
  }

  update(id: number, updateTokenizedAssetDto: UpdateTokenizedAssetDto) {
    return `This action updates a #${id} tokenizedAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} tokenizedAsset`;
  }
}
