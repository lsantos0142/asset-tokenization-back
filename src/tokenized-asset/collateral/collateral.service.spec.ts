import { Test, TestingModule } from "@nestjs/testing";
import { CollateralService } from "./collateral.service";

describe("CollateralService", () => {
    let service: CollateralService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CollateralService],
        }).compile();

        service = module.get<CollateralService>(CollateralService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
