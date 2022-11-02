import { Test, TestingModule } from '@nestjs/testing';
import { RentPaymentController } from './rent-payment.controller';
import { RentPaymentService } from './rent-payment.service';

describe('RentPaymentController', () => {
  let controller: RentPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentPaymentController],
      providers: [RentPaymentService],
    }).compile();

    controller = module.get<RentPaymentController>(RentPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
