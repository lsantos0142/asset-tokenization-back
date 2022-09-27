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

@Entity({ name: "RentPayment" })
export class RentPayment extends BaseEntity {
    //#region baseEntity fields
    @PrimaryGeneratedColumn()
    @PrimaryColumn({ type: "bigint" })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    //#endregion

    @Column({ type: "date" })
    public paymentDate: Date;

    @Column({ type: "decimal" })
    public percentagePaid: number;

    @Column({ type: "decimal" })
    public valuePaid: number;

    @ManyToOne((type) => UserToTokenizedAsset, (uta) => uta.rentPayments)
    public userToTokenizedAsset: UserToTokenizedAsset;
}
