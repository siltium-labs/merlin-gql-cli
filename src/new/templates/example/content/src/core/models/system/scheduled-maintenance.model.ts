import { SimpleBaseModel } from "merlin-gql";
import { Entity, Column } from "typeorm";



@Entity()
export class ScheduledMaintenance extends SimpleBaseModel {
    @Column("timestamp")
    from: Date = new Date();

    @Column("timestamp", { nullable: true })
    to: Date | null = null;

    @Column("varchar")
    reason: string = "";
}
