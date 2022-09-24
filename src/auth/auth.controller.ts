import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

class Login {
  username: string;
  password: string;
}

@Controller("auth")
@ApiTags("Auth")
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
