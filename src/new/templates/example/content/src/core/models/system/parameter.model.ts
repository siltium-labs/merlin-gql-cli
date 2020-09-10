
import { Entity, Column, PrimaryColumn, getManager } from "typeorm";

export enum ParametersEnum {
  GracePeriod = "grace_period",
  ExchangeGracePeriod = "exchange_grace_period"
}

@Entity()
export class Parameter {
  @PrimaryColumn("varchar")
  name: string = "";

  @Column("varchar", { nullable: true })
  stringValue: string | null = null;

  @Column("text", { nullable: true })
  textValue: string | null = null;

  @Column("real", { nullable: true })
  numberValue: number | null = null;

  @Column("timestamp", { nullable: true })
  dateValue: Date | null = null;

  public static async getByName(name: ParametersEnum) {
    return await getManager()
      .createQueryBuilder(Parameter, "p")
      .where("p.name = :name", { name })
      .getOne();
  }
}
