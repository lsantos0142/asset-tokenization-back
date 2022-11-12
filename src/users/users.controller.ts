import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("Users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    // @UseGuards(AuthGuard("jwt"))
    // @ApiBearerAuth("JWT-auth")
    @Get()
    async index() {
        return this.mapper.mapArrayAsync(
            await this.usersService.findAll(),
            User,
            UserResponseDto,
        );
    }

    @Post()
    async store(@Body() body: CreateUserDto) {
        return await this.usersService.store(body);
    }

    // @UseGuards(AuthGuard("jwt"))
    // @ApiBearerAuth("JWT-auth")
    @Get(":id")
    async show(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.mapper.mapAsync(
            await this.usersService.find(id),
            User,
            UserResponseDto,
        );
    }

    // @UseGuards(AuthGuard("jwt"))
    // @ApiBearerAuth("JWT-auth")
    @Put(":id")
    async update(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body() body: UpdateUserDto,
    ) {
        return await this.usersService.update(id, body);
    }

    // @UseGuards(AuthGuard("jwt"))
    // @ApiBearerAuth("JWT-auth")
    @Put(":id/:wallet")
    async updateWallet(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Param("wallet") walletAddress: string,
    ) {
        return await this.usersService.updateWallet(id, walletAddress);
    }

    // @UseGuards(AuthGuard("jwt"))
    // @ApiBearerAuth("JWT-auth")
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async destroy(@Param("id", new ParseUUIDPipe()) id: string) {
        await this.usersService.destroy(id);
    }
}
