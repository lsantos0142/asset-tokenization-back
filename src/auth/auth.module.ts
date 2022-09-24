import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
