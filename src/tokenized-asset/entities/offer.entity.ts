import { AutoMap } from "@automapper/classes";
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
    @AutoMap()
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

    @AutoMap()
    @Column({ type: "decimal" })
    public percentage: number;

    @AutoMap()
    @Column({ type: "decimal" })
    public amount: number;

    @AutoMap()
    @Column({ type: "boolean" })
    public isEffectiveTransfer: boolean;

    @AutoMap()
    @Column({ type: "varchar", nullable: true })
    public receipt: string;

    @AutoMap()
    @Column({ type: "enum", enum: OfferStatus, default: OfferStatus.AVAILABLE })
    public status: string;

    @AutoMap(() => Ownership)
    @ManyToOne(() => Ownership, (o) => o.offers)
    public ownership: Ownership;

    @AutoMap(() => User)
    @ManyToOne(() => User, (u) => u.requestedOffers)
    public currentBuyer: User;
}
