import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
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
import { ApiTags } from "@nestjs/swagger";
import { Offer } from "../entities/offer.entity";
import { AcceptOfferDto } from "./dto/accept-offer.dto";
import { AddReceiptDto } from "./dto/add-receipt.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferResponseDto } from "./dto/offer-response.dto";
import { OfferService } from "./offer.service";

@Controller("tokenized-asset/offer")
@ApiTags("Tokenized Assets / Offers")
export class OfferController {
    constructor(
        private readonly offerService: OfferService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @Get("get-by-ownership/:id")
    getOffersByOwnership(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersByOwnership(id);
    }

    @Get("get-by-user/:id")
    getOffersByUser(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersByUser(id);
    }

    @Get("get-by-buyer/:id")
    getOffersByBuyer(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersByBuyer(id);
    }

    @Get("get-by-id/:id")
    getOffersById(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.getOffersById(id);
    }

    @Post("add-receipt")
    addReceiptOnOffer(@Body() data: AddReceiptDto) {
        return this.offerService.addReceiptOnOffer(data);
    }

    @Get("get-all")
    async getAllOffers(@Query("status") status: string) {
        return this.mapper.mapArrayAsync(
            await this.offerService.getAllOffersByStatus(status),
            Offer,
            OfferResponseDto,
        );
    }

    @Put("accept")
    async acceptOffer(@Body() data: AcceptOfferDto) {
        return this.mapper.mapAsync(
            await this.offerService.acceptOffer(data),
            Offer,
            OfferResponseDto,
        );
    }

    @Put("reject-payment/:id")
    rejectOfferPayment(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.offerService.rejectOfferPayment(id);
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
