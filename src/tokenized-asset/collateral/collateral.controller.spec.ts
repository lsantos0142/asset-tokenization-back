import { Test, TestingModule } from "@nestjs/testing";
import { CollateralController } from "./collateral.controller";
import { CollateralService } from "./collateral.service";

describe("CollateralController", () => {
    let controller: CollateralController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CollateralController],
            providers: [CollateralService],
        }).compile();

        controller = module.get<CollateralController>(CollateralController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
