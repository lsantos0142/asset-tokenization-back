import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserToTokenizedAsset } from "./user-to-tokenized-asset.entity";

@Entity({ name: "RentPayment" })
export class RentPayment {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "bigint" })
  public id: number;

  @Column({ type: "date" })
  public paymentDate: Date;

  @Column({ type: "decimal" })
  public percentagePaid: number;

  @Column({ type: "decimal" })
  public valuePaid: number;

  @ManyToOne((type) => UserToTokenizedAsset, (uta) => uta.rentPayments)
  public userToTokenizedAsset: UserToTokenizedAsset;
}
