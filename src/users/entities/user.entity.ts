import { UserToTokenizedAsset } from "src/tokenized-asset/entities/user-to-tokenized-asset.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public username: string;

  @Column({ type: "varchar" })
  public password: string;

  @OneToMany((type) => UserToTokenizedAsset, (uta) => uta.user)
  public userToTokenizedAssets: UserToTokenizedAsset[];
}
