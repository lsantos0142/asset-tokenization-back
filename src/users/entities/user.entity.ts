import { UserToTokenizedAsset } from "src/tokenized-asset/entities/user-to-tokenized-asset.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "Users" })
export class Users extends BaseEntity {
  //#region baseEntity fields
  @PrimaryGeneratedColumn("uuid")
  @PrimaryColumn({ type: "uuid" })
  public id: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public username: string;

  @Column({ type: "varchar" })
  public password: string;

  @Column({ type: "varchar" })
  public walletAddress: string;

  @OneToMany((type) => UserToTokenizedAsset, (uta) => uta.user)
  public userToTokenizedAssets: UserToTokenizedAsset[];
}
