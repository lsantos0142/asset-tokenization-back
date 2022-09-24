import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { MessagesHelper } from "src/helpers/messages.helper";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "username" });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if(!user) {
        throw new UnauthorizedException(MessagesHelper.PASSWORD_OR_EMAIL_INVALID);
    }

    return user;
  }
}