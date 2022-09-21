import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async find(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.usersRepository.find({
      select: ['id', 'name', 'username'],
    });
  }

  async store(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.usersRepository.findOneBy({ id });
    this.usersRepository.softDelete({ id });
  }
}
