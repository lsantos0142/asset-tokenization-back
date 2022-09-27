import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, compareSync } from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login-dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async getTokens(id: string, username: string, isAdmin: boolean) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                    isAdmin,
                },
                { secret: process.env.AT_JWT_SECRET_KEY, expiresIn: 60 * 30 },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                    isAdmin,
                },
                {
                    secret: process.env.RT_JWT_SECRET_KEY,
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByUsername(loginDto.username);

        if (!user) throw new ForbiddenException("Acesso Negado");

        const passwordMatches = await compare(loginDto.password, user.password);
        if (!passwordMatches) throw new ForbiddenException("Acesso Negado");

        const tokens = await this.getTokens(
            user.id,
            user.username,
            user.isAdmin,
        );
        await this.userService.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async signup(userDTO: CreateUserDto) {
        const user = await this.userService.store(userDTO);

        const tokens = await this.getTokens(
            user.id,
            user.username,
            user.isAdmin,
        );
        await this.userService.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(id: string) {
        await this.userService.updateRtHash(id, null);
    }

    async refresh(id: string, rt: string) {
        const user = await this.userService.find(id);
        if (!user) throw new ForbiddenException("Acesso Negado");

        const rtMatches = await compare(rt.trim(), user.hashedRt);
        if (!rtMatches) throw new ForbiddenException("Acesso Negado");

        const tokens = await this.getTokens(
            user.id,
            user.username,
            user.isAdmin,
        );
        await this.userService.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async validateUser(username: string, password: string) {
        let user: User;
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
