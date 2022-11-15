import { AutoMap } from "@automapper/classes";
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

export enum CollateralStatus {
    PENDING_CONFIRMATION,
    ACTIVE,
    SEIZED,
    CANCELED,
    AWAITING_LOAN_PAYMENT_VALIDATION,
    LOAN_PAID,
}

@Entity({ name: "Collateral" })
export class Collateral extends BaseEntity {
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
    @Column({ type: "varchar" })
    public bankWallet: string;

    @AutoMap()
    @Column({ type: "decimal" })
    public percentage: number;

    @AutoMap()
    @Column({ type: "varchar" })
    public expirationDate: string;

    @AutoMap()
    @Column({
        type: "enum",
        enum: CollateralStatus,
        default: CollateralStatus.ACTIVE,
    })
    public status: string;

    @AutoMap(() => Ownership)
    @ManyToOne(() => Ownership, (uta) => uta.collaterals)
    public ownership: Ownership;
}
