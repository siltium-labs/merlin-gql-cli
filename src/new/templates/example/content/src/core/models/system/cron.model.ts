import { SimpleBaseModel } from "merlin-gql";
import { Entity, Column } from "typeorm";

@Entity()
export class Cron extends SimpleBaseModel {
    @Column("varchar")
    expression: string = "";

    @Column("varchar")
    name: string = "";

    @Column("text")
    description: string = "";

    @Column("bool")
    active: boolean = true;
}
