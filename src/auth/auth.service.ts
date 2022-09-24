import { Injectable } from "@nestjs/common";
import { Users } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: Users) {
    const payload = { sub: user.id, username: user.username };

    return { token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string) {
    let user: Users;
    try {
      user = await this.userService.findOneOrFail({ username });
    } catch (e) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }
}
