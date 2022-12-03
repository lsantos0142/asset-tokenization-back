import { Test, TestingModule } from "@nestjs/testing";
import { RentPaymentService } from "./rent-payment.service";

describe("RentPaymentService", () => {
    let service: RentPaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RentPaymentService],
        }).compile();

        service = module.get<RentPaymentService>(RentPaymentService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
