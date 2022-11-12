import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateRentPaymentDto } from "./dto/create-rent-payment.dto";
import { RentPaymentService } from "./rent-payment.service";

@Controller("tokenized-asset/rent-payment")
@ApiTags("Tokenized Assets / Rent Payments")
export class RentPaymentController {
    constructor(private readonly rentPaymentService: RentPaymentService) {}

    @Get("get-by-ownership/:id")
    getOffersByOwnership(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.rentPaymentService.getRentPaymentsByOwnership(id);
    }

    @Post("create")
    createOffer(@Body() data: CreateRentPaymentDto) {
        return this.rentPaymentService.createRentPayment(data);
    }
}
