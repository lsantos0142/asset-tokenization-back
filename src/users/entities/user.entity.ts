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

@Entity({ name: "User" })
export class User extends BaseEntity {
  //#region baseEntity fields
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
  //#endregion

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public username: string;

  @Column({ type: "varchar" })
  public password: string;

  @OneToMany((type) => UserToTokenizedAsset, (uta) => uta.user)
  public userToTokenizedAssets: UserToTokenizedAsset[];
}
