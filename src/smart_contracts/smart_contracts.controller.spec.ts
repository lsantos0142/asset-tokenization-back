import { Test, TestingModule } from "@nestjs/testing";
import { SmartContractsController } from "./smart_contracts.controller";
import { SmartContractsService } from "./smart_contracts.service";

describe("SmartContractsController", () => {
    let controller: SmartContractsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SmartContractsController],
            providers: [SmartContractsService],
        }).compile();

        controller = module.get<SmartContractsController>(
            SmartContractsController,
        );
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
