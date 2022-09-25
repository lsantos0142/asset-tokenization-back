import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CreateTokenizedAssetDto } from "./dto/create-tokenized-asset.dto";
import { CreateUserToTokenizedAssetDto } from "./dto/create-user-to-tokenized-asset.dto";
import { UpdateTokenizedAssetDto } from "./dto/update-tokenized-asset.dto";
import { UserToTokenizedAsset } from "./entities/user-to-tokenized-asset.entity";

@Injectable()
export class TokenizedAssetService {
  constructor(
    @InjectRepository(UserToTokenizedAsset)
    private userToAssetRepository: Repository<UserToTokenizedAsset>,
    private readonly usersService: UsersService,
  ) {}

  create(createTokenizedAssetDto: CreateTokenizedAssetDto) {
    return "This action adds a new tokenizedAsset";
  }

  findAll() {
    return `This action returns all tokenizedAsset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tokenizedAsset`;
  }

  update(id: number, updateTokenizedAssetDto: UpdateTokenizedAssetDto) {
    return `This action updates a #${id} tokenizedAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} tokenizedAsset`;
  }

  async createUserToAsset(data: CreateUserToTokenizedAssetDto, userId: string) {
    const userToAsset = this.userToAssetRepository.create(data);
    const loggedUser = await this.usersService.find(userId);

    userToAsset.user = loggedUser;

    const savedUserToAsset = await this.userToAssetRepository.save(userToAsset);

    return savedUserToAsset;
  }
}
