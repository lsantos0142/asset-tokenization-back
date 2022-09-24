import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.AT_JWT_SECRET_KEY,
        });
      }
    
      async validate(payload: any) {
        return payload;
      }
}
