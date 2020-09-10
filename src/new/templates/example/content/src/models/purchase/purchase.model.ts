import { SimpleBaseModel } from "merlin-gql";

import { Entity, Column, ManyToOne } from "typeorm";
import { Customer } from "../customer/customer.model";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class Purchase extends SimpleBaseModel {
  @Field()
  @Column("double")
  total: number = 0;

  @Column("varchar")
  secret: string = "";

  @Field((type) => Customer)
  @ManyToOne((_) => Customer, "purchases")
  customer?: Promise<Customer>;
}
