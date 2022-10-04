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

export enum OfferStatus {
    AVAILABLE,
    ACCEPTED,
    CANCELED,
}

@Entity({ name: "Offer" })
export class Offer extends BaseEntity {
    //#region baseEntity fields
    @PrimaryGeneratedColumn()
    @PrimaryColumn({ type: "bigint" })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    //#endregion

    @Column({ type: "decimal" })
    public percentage: number;

    @Column({ type: "decimal" })
    public amount: number;

    @Column({ type: "enum", enum: OfferStatus, default: OfferStatus.AVAILABLE })
    public status: string;

    @ManyToOne((type) => Ownership, (uta) => uta.offers)
    public ownership: Ownership;
}
