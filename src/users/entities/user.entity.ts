import { AutoMap } from "@automapper/classes";
import { hashSync } from "bcrypt";
import { Offer } from "src/tokenized-asset/entities/offer.entity";
import { Ownership } from "src/tokenized-asset/entities/ownership.entity";
import { TokenizationProposal } from "src/tokenized-asset/entities/tokenization-proposal.entity";
import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "User" })
export class User extends BaseEntity {
    @AutoMap()
    @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn({ type: "uuid" })
    public id: string;

    @AutoMap()
    @Column({ type: "varchar" })
    public name: string;

    @AutoMap()
    @Column({ type: "varchar", unique: true })
    public cpf: string;

    @AutoMap()
    @Column({ type: "varchar", unique: true })
    public username: string;

    @Column({ type: "varchar" })
    public password: string;

    @AutoMap()
    @Column({ type: "varchar", nullable: true })
    public walletAddress: string;

    @AutoMap()
    @OneToMany(() => Ownership, (o) => o.user)
    public ownerships: Ownership[];

    @AutoMap()
    @OneToMany(() => TokenizationProposal, (tp) => tp.user)
    public tokenizationProposal: TokenizationProposal[];

    @OneToMany(() => Offer, (o) => o.currentBuyer)
    public requestedOffers: Offer[];

    @BeforeInsert()
    hashPassword = () => {
        this.password = hashSync(this.password, 10);
    };

    @AutoMap()
    @Column({ type: "bool" })
    isAdmin: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: string;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: string;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: string;

    @Column({ type: "varchar", nullable: true })
    hashedRt: string;
}
