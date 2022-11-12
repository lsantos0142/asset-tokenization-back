import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Ownership } from "../entities/ownership.entity";
import { OwnershipResponseDto } from "./dto/ownership-response.dto";
import { UpsertOwnershipDto } from "./dto/upsert-ownership.dto";
import { OwnershipService } from "./ownership.service";

@Controller("tokenized-asset/ownership")
@ApiTags("Tokenized Assets / Ownership")
export class OwnershipController {
    constructor(
        private readonly ownershipService: OwnershipService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @Get("get-by-user/:id")
    async getOwnershipsByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.mapper.mapArrayAsync(
            await this.ownershipService.getOwnershipsByUser(id),
            Ownership,
            OwnershipResponseDto,
        );
    }

    @Post("transfer")
    async upsertOwnershipFromTransfer(@Body() data: UpsertOwnershipDto) {
        return this.mapper.mapAsync(
            await this.ownershipService.upsertOwnershipFromTransfer(data),
            Ownership,
            OwnershipResponseDto,
        );
    }
}
