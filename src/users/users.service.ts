import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const createUser = this.userRepository.create(createUserDto);
    return createUser.save();
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      return this.userRepository.findOneBy({ id: id });
    } catch (exception) {
      throw exception;
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) throw new Error("User not found.");

    return user.remove();
  }
}
