import { AutoMap } from "@automapper/classes";
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
    @AutoMap()
    @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn({ type: "uuid" })
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    //#endregion

    @AutoMap()
    @Column({ type: "varchar" })
    public address: string;

    @AutoMap()
    @Column({ type: "varchar" })
    public registration: string;

    @AutoMap()
    @Column({ type: "decimal" })
    public usableArea: number;

    @AutoMap()
    @Column({ type: "varchar" })
    public contractAddress: string;

    @AutoMap()
    @OneToMany(() => Ownership, (o) => o.tokenizedAsset)
    public ownerships: Ownership[];

    @AutoMap(() => TokenizationProposal)
    @OneToOne(() => TokenizationProposal)
    @JoinColumn()
    public tokenizationProposal: TokenizationProposal;
}
