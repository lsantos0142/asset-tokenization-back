import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Ownership } from "./ownership.entity";
import { TokenizationProposal } from "./tokenization-proposal.entity";

@Entity({ name: "TokenizedAsset" })
export class TokenizedAsset extends BaseEntity {
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

    @Column({ type: "varchar" })
    public contractAddress: string;

    @OneToMany(() => Ownership, (o) => o.tokenizedAsset)
    public ownerships: Ownership[];

    @OneToOne(() => TokenizationProposal)
    @JoinColumn()
    public tokenizationProposal: TokenizationProposal;
}
