import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { AcceptOfferDto } from "./dto/accept-offer.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferService } from "./offer.service";

@Controller("tokenized-asset/offer")
export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    @Get("get-by-ownership/:id")
    getOffersByOwnership(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersByOwnership(id);
    }

    @Get("get-all")
    getAllOffers(@Query("status") status: string) {
        return this.offerService.getAllOffersByStatus(status);
    }

    @Put("accept/")
    acceptOffer(@Body() data: AcceptOfferDto) {
        return this.offerService.acceptOffer(data);
    }

    @Put("validate-payment/:id")
    validateOfferPayment(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.validateOfferPayment(id);
    }

    @Post("create")
    createOffer(@Body() data: CreateOfferDto) {
        return this.offerService.createOffer(data);
    }
}
