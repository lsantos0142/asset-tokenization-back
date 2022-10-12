import { Test, TestingModule } from '@nestjs/testing';
import { OwnershipController } from './ownership.controller';
import { OwnershipService } from './ownership.service';

describe('OwnershipController', () => {
  let controller: OwnershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnershipController],
      providers: [OwnershipService],
    }).compile();

    controller = module.get<OwnershipController>(OwnershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
