import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { configService } from "./config/config.service";
import { SmartContractsModule } from "./smart_contracts/smart_contracts.module";
import { TokenizedAssetModule } from "./tokenized-asset/tokenized-asset.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    SmartContractsModule,
    UsersModule,
    TokenizedAssetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
