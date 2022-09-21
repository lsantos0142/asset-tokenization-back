import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTokenizedAssetDto } from "./dto/create-tokenized-asset.dto";
import { UpdateTokenizedAssetDto } from "./dto/update-tokenized-asset.dto";
import { TokenizedAssetService } from "./tokenized-asset.service";

@Controller("tokenized-asset")
@ApiTags("Tokenized Assets")
export class TokenizedAssetController {
  constructor(private readonly tokenizedAssetService: TokenizedAssetService) {}

  @Post()
  create(@Body() createTokenizedAssetDto: CreateTokenizedAssetDto) {
    return this.tokenizedAssetService.create(createTokenizedAssetDto);
  }

  @Get()
  findAll() {
    return this.tokenizedAssetService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tokenizedAssetService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTokenizedAssetDto: UpdateTokenizedAssetDto,
  ) {
    return this.tokenizedAssetService.update(+id, updateTokenizedAssetDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tokenizedAssetService.remove(+id);
  }
}
