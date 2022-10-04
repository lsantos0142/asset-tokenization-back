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

    @ManyToOne((type) => Ownership, (uta) => uta.collaterals)
    public ownership: Ownership;
}
