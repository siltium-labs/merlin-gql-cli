import { PersonFilterFields } from "./person.filters";
import { PersonSortFields } from "./person.sort";

import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "../user/user.model";
import { Inputs, Sorts, Filters, SimpleBaseModel } from "merlin-gql";
import { PersonInput } from "./person.input";

@Entity()
@Inputs(PersonInput)
@Sorts(PersonSortFields)
@Filters(PersonFilterFields)
@ObjectType()
export class Person extends SimpleBaseModel {
  @Field()
  @Column("varchar")
  name: string = "John Doe";

  @Field((type) => Int)
  @Column("int")
  age: number = 5;

  @Field((type) => Int)
  @Column("int")
  userId: number = 5;

  @Field((type) => User)
  @OneToOne((_) => User, "person")
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user?: Promise<User>;

  @DeleteDateColumn()
  deletedDate: Date | null = null;
}
