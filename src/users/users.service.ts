import { Injectable, Logger, NotFoundException } from "@nestjs/common";
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

  async findOneOrFail(condition: any) {
    try{
      return await this.usersRepository.findOneByOrFail(condition);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async find(id: string) {
    const user = await this.findOneOrFail({ id });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      walletAddress: user.walletAddress
    };
  }

  async findAll() {
    return await this.usersRepository.find({
      select: ["id", "name", "username", "walletAddress"],
    });
  }

  async store(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      walletAddress: user.walletAddress
    };
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOneOrFail({ id });

    this.usersRepository.merge(user, data);
    await this.usersRepository.save(user);
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      walletAddress: user.walletAddress
    };
  }

  async destroy(id: string) {
    const user = await this.findOneOrFail({ id });
    this.usersRepository.softDelete({ id });
  }
}
