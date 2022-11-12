import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfile } from "src/profiles/user-profile";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ],
    controllers: [UsersController],
    providers: [UsersService, UserProfile],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
