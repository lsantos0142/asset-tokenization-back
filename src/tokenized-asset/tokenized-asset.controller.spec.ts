import { Test, TestingModule } from "@nestjs/testing";
import { TokenizedAssetController } from "./tokenized-asset.controller";
import TokenizedAssetService from "./tokenized-asset.service";

describe("TokenizedAssetController", () => {
  let controller: TokenizedAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenizedAssetController],
      providers: [TokenizedAssetService],
    }).compile();

    controller = module.get<TokenizedAssetController>(TokenizedAssetController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
