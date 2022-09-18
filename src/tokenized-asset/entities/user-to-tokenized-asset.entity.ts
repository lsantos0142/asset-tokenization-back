import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Collateral } from "./collateral.entity";
import { RentPayment } from "./rent-payment.entity";
import { TokenizedAsset } from "./tokenized-asset.entity";

@Entity({ name: "UserToTokenizedAsset" })
export class UserToTokenizedAsset {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @Column({ type: "boolean" })
  public isEffectiveOwner: boolean;

  @Column({ type: "decimal" })
  public percentageOwned: number;

  @OneToMany(
    (type) => Collateral,
    (collateral) => collateral.userToTokenizedAsset,
  )
  public collaterals: Collateral[];

  @OneToMany((type) => RentPayment, (rp) => rp.userToTokenizedAsset)
  public rentPayments: RentPayment[];

  @ManyToOne((type) => User, (user) => user.userToTokenizedAssets)
  public user: User;

  @ManyToOne((type) => TokenizedAsset, (ta) => ta.userToTokenizedAssets)
  public tokenizedAsset: TokenizedAsset;
}
