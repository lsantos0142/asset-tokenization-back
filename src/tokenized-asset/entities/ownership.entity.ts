import { AutoMap } from "@automapper/classes";
import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Collateral } from "./collateral.entity";
import { Offer } from "./offer.entity";
import { RentPayment } from "./rent-payment.entity";
import { TokenizedAsset } from "./tokenized-asset.entity";

@Entity({ name: "Ownership" })
export class Ownership extends BaseEntity {
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
    @Column({ type: "boolean" })
    public isEffectiveOwner: boolean;

    @AutoMap()
    @Column({ type: "decimal" })
    public percentageOwned: number;

    @OneToMany(() => Collateral, (collateral) => collateral.ownership)
    public collaterals: Collateral[];

    @OneToMany(() => Offer, (offer) => offer.ownership)
    public offers: Offer[];

    @OneToMany(() => RentPayment, (rp) => rp.ownership)
    public rentPayments: RentPayment[];

    @AutoMap(() => User)
    @ManyToOne(() => User, (user) => user.ownerships)
    public user: User;

    @AutoMap(() => TokenizedAsset)
    @ManyToOne(() => TokenizedAsset, (ta) => ta.ownerships)
    public tokenizedAsset: TokenizedAsset;
}
