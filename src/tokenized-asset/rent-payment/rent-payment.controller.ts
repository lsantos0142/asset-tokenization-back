import { Controller } from '@nestjs/common';
import { RentPaymentService } from './rent-payment.service';

@Controller('rent-payment')
export class RentPaymentController {
  constructor(private readonly rentPaymentService: RentPaymentService) {}
}
