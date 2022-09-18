import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserToTokenizedAsset } from "./user-to-tokenized-asset.entity";

@Entity({ name: "Collateral" })
export class Collateral {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @Column({ type: "varchar" })
  public bankWallet: string;

  @Column({ type: "decimal" })
  public percentage: number;

  @Column({ type: "date" })
  public expirationDate: Date;

  @ManyToOne((type) => UserToTokenizedAsset, (uta) => uta.collaterals)
  public userToTokenizedAsset: UserToTokenizedAsset;
}
