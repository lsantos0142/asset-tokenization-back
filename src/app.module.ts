import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from'@nestjs/typeorm';
import { AppService } from './app.service';
import { configService } from'./config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
