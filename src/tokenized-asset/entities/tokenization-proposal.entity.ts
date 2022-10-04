import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
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
    @PrimaryGeneratedColumn()
    @PrimaryColumn({ type: "bigint" })
    public id: number;

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
}
