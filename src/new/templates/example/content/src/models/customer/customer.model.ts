import { SimpleBaseModel } from "merlin-gql";
import { Field, ObjectType } from "type-graphql";

import { Entity, Column, OneToMany } from "typeorm";
import { Purchase } from "../purchase/purchase.model";

@ObjectType()
@Entity()
export class Customer extends SimpleBaseModel {
  @Field()
  @Column("varchar")
  name: string = "";

  @Field()
  @Column("varchar")
  lastName: string = "";

  @Field((type) => [Purchase])
  @OneToMany((_) => Purchase, "customer")
  purchases?: Promise<Purchase[]>;
}
