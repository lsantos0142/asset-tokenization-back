import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserToTokenizedAsset } from "./user-to-tokenized-asset.entity";

@Entity({ name: "TokenizedAsset" })
export class TokenizedAsset {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "decimal" })
  public usableArea: number;

  @Column({ type: "varchar" })
  public contractAddress: string;

  @OneToMany((type) => UserToTokenizedAsset, (uta) => uta.tokenizedAsset)
  public userToTokenizedAssets: UserToTokenizedAsset[];
}
