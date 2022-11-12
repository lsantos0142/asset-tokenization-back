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

@Entity({ name: "Collateral" })
export class Collateral extends BaseEntity {
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

    @Column({ type: "varchar" })
    public bankWallet: string;

    @Column({ type: "decimal" })
    public percentage: number;

    @Column({ type: "varchar" })
    public expirationDate: string;

    @ManyToOne(() => Ownership, (uta) => uta.collaterals)
    public ownership: Ownership;
}
