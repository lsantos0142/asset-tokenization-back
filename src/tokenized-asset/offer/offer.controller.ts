import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from "@nestjs/common";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferService } from "./offer.service";

@Controller("tokenized-asset/offer")
export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    @Get("get-by-ownership/:id")
    getOwnershipsByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersByOwnership(id);
    }

    @Post("create")
    createOffer(@Body() data: CreateOfferDto) {
        return this.offerService.createOffer(data);
    }
}
