import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserToTokenizedAsset } from "./user-to-tokenized-asset.entity";

@Entity({ name: "Collateral" })
export class Collateral extends BaseEntity {
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
  public bankWallet: string;

  @Column({ type: "decimal" })
  public percentage: number;

  @Column({ type: "date" })
  public expirationDate: Date;

  @ManyToOne((type) => UserToTokenizedAsset, (uta) => uta.collaterals)
  public userToTokenizedAsset: UserToTokenizedAsset;
}
