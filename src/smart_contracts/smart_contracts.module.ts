import { Module } from '@nestjs/common';
import { SmartContractsService } from './smart_contracts.service';
import { SmartContractsController } from './smart_contracts.controller';

@Module({
  controllers: [SmartContractsController],
  providers: [SmartContractsService]
})
export class SmartContractsModule {}
