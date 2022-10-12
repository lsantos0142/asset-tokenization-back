import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { TokenizedAsset } from "./tokenized-asset.entity";

export enum ProposalStatus {
    PENDING,
    APPROVED,
    REFUSED,
}

@Entity({ name: "TokenizationProposal" })
export class TokenizationProposal extends BaseEntity {
    //#region baseEntity fields
    @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn({ type: "uuid" })
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    //#endregion

    @Column({ type: "varchar" })
    public address: string;

    @Column({ type: "varchar" })
    public registration: string;

    @Column({ type: "varchar" })
    public deed: string;

    @Column({ type: "decimal" })
    public usableArea: number;

    @Column({
        type: "enum",
        enum: ProposalStatus,
        default: ProposalStatus.PENDING,
    })
    public status: string;

    @OneToOne(() => TokenizedAsset)
    public tokenizedAsset: TokenizedAsset;

    @ManyToOne(() => User, (user) => user.ownerships)
    public user: User;
}
