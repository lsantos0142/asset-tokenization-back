import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    @PrimaryColumn({ type: 'bigint' })
    public id: number;

    @Column({ type: 'varchar' })
    public name: string;

    @Column({ type: 'varchar' })
    public username: string;

    @Column({ type: 'varchar' })
    public password: string;
}
