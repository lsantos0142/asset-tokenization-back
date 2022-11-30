import { AutoMap } from "@automapper/classes";
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

    @Column({ type: "varchar", nullable: true })
    public document: string;

    @AutoMap()
    @Column({ type: "decimal" })
    public usableArea: number;

    @AutoMap()
    @Column({
        type: "enum",
        enum: ProposalStatus,
        default: ProposalStatus.PENDING,
    })
    public status: string;

    @AutoMap()
    @OneToOne(() => TokenizedAsset)
    public tokenizedAsset: TokenizedAsset;

    @AutoMap(() => User)
    @ManyToOne(() => User, (user) => user.ownerships)
    public user: User;
}
