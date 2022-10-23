import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Ownership } from "./ownership.entity";

export enum OfferStatus {
    AVAILABLE,
    WAITING_PAYMENT,
    ACCEPTED,
    CANCELED,
}

@Entity({ name: "Offer" })
export class Offer extends BaseEntity {
    //#region baseEntity fields
    @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn({ type: "uuid" })
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: string;
    //#endregion

    @Column({ type: "decimal" })
    public percentage: number;

    @Column({ type: "decimal" })
    public amount: number;

    @Column({ type: "enum", enum: OfferStatus, default: OfferStatus.AVAILABLE })
    public status: string;

    @ManyToOne(() => Ownership, (o) => o.offers)
    public ownership: Ownership;

    @ManyToOne(() => User, (u) => u.requestedOffers)
    public currentBuyer: User;
}
