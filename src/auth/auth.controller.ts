import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login-dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @UseGuards(AuthGuard("local"))
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    const user = req.user;
    return this.authService.logout(user.sub);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any) {
    const user = req.user;
    return this.authService.refresh(user.sub, user.refreshToken);
  }
}
