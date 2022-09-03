import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from'@nestjs/typeorm';
import { AppService } from './app.service';
import { SmartContractsModule } from './smart_contracts/smart_contracts.module';
import { configService } from'./config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    SmartContractsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
