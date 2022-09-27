import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserToTokenizedAsset } from "./user-to-tokenized-asset.entity";

@Entity({ name: "TokenizedAsset" })
export class TokenizedAsset extends BaseEntity {
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
    public identification: string;

    @Column({ type: "decimal" })
    public usableArea: number;

    @Column({ type: "varchar" })
    public contractAddress: string;

    @OneToMany(() => UserToTokenizedAsset, (uta) => uta.tokenizedAsset)
    public userToTokenizedAssets: UserToTokenizedAsset[];
}
