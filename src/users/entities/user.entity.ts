import { hashSync } from "bcrypt";
import { Ownership } from "src/tokenized-asset/entities/ownership.entity";
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
    @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn({ type: "uuid" })
    public id: string;

    @Column({ type: "varchar" })
    public name: string;

    @Column({ type: "varchar", unique: true })
    public username: string;

    @Column({ type: "varchar" })
    public password: string;

    @Column({ type: "varchar", nullable: true })
    public walletAddress: string;

    @OneToMany(() => Ownership, (uta) => uta.user)
    public ownerships: Ownership[];

    @BeforeInsert()
    hashPassword = () => {
        this.password = hashSync(this.password, 10);
    };

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
