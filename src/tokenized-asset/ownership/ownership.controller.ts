import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UpsertOwnershipDto } from "../dto/upsert-ownership.dto";
import { OwnershipService } from "./ownership.service";

@Controller("tokenized-asset/ownership")
@ApiTags("Tokenized Assets / Ownership")
export class OwnershipController {
    constructor(private readonly ownershipService: OwnershipService) {}

    @Get("ownership/get-by-user/:id")
    getOwnershipsByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.ownershipService.getOwnershipsByUser(id);
    }

    @Post("ownership/transfer")
    upsertOwnershipFromTransfer(@Body() data: UpsertOwnershipDto) {
        return this.ownershipService.upsertOwnershipFromTransfer(data);
    }
}
