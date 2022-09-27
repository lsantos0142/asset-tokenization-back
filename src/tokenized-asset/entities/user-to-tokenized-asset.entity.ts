import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Collateral } from "./collateral.entity";
import { RentPayment } from "./rent-payment.entity";
import { TokenizedAsset } from "./tokenized-asset.entity";

@Entity({ name: "UserToTokenizedAsset" })
export class UserToTokenizedAsset extends BaseEntity {
    //#region baseEntity fields
    @PrimaryGeneratedColumn()
    @PrimaryColumn({ type: "bigint" })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    //#endregion

    @Column({ type: "boolean" })
    public isEffectiveOwner: boolean;

    @Column({ type: "decimal" })
    public percentageOwned: number;

    @OneToMany(
        () => Collateral,
        (collateral) => collateral.userToTokenizedAsset,
    )
    public collaterals: Collateral[];

    @OneToMany(() => RentPayment, (rp) => rp.userToTokenizedAsset)
    public rentPayments: RentPayment[];

    @ManyToOne(() => User, (user) => user.userToTokenizedAssets)
    public user: User;

    @ManyToOne(() => TokenizedAsset, (ta) => ta.userToTokenizedAssets)
    public tokenizedAsset: TokenizedAsset;
}
