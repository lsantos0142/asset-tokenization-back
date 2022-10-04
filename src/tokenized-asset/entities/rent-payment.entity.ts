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
import { Ownership } from "./ownership.entity";

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
    public percentage: number;

    @Column({ type: "decimal" })
    public amount: number;

    @ManyToOne((type) => Ownership, (uta) => uta.rentPayments)
    public ownerships: Ownership;
}
