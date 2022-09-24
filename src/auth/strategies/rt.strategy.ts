import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.RT_JWT_SECRET_KEY,
          passReqToCallback: true
        });
      }
    
      async validate(req: Request, payload: any) {
        const refreshToken = req.get("Authorization").replace("Bearer","").trim();
        return { ...payload, refreshToken };
      }
}
