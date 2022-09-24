import { UserToTokenizedAsset } from "src/tokenized-asset/entities/user-to-tokenized-asset.entity";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { hashSync } from "bcrypt";

@Entity({ name: "Users" })
export class Users extends BaseEntity {
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

  @BeforeInsert()
  hashPassword = () => {
    this.password = hashSync(this.password, 10);
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

}
