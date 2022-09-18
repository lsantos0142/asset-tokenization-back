import { Test, TestingModule } from "@nestjs/testing";
import { TokenizedAssetService } from "./tokenized-asset.service";

describe("TokenizedAssetService", () => {
  let service: TokenizedAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenizedAssetService],
    }).compile();

    service = module.get<TokenizedAssetService>(TokenizedAssetService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
