import { Column, Entity, JoinColumn, OneToOne, DeleteDateColumn } from "typeorm";
import { SimpleBaseModel } from "merlin-gql";
import { User } from "../user/user.model";

@Entity()
export class Person extends SimpleBaseModel {
    
    @Column("varchar")
    name: string = "";

    @Column("int")
    age: number = 0;

    @DeleteDateColumn()
    deletedDate: Date | null = null;

    @OneToOne(() => User, (user) => user.person)
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user?: Promise<User>;
}
