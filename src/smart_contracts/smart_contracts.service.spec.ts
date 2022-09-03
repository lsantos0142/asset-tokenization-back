import { Test, TestingModule } from '@nestjs/testing';
import { SmartContractsService } from './smart_contracts.service';

describe('SmartContractsService', () => {
  let service: SmartContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartContractsService],
    }).compile();

    service = module.get<SmartContractsService>(SmartContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
