import { Filters, Inputs, SimpleBaseModel, Sorts } from "merlin-gql";
import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Person } from "./../person/person.model";
import { UserFilterFields } from "./user.filters";
import { UserInput } from "./user.input";
import { UserSortFields } from "./user.sort";
import { Role } from "../role/role.model";

@Entity()
@Inputs(UserInput)
@Sorts(UserSortFields)
@Filters(UserFilterFields)
@ObjectType()
export class User extends SimpleBaseModel {
  @Field()
  @Column("varchar")
  username: string = "";

  @Field((type) => Int)
  @Column("varchar")
  password: string = "";

  @Field()
  @Column("varchar")
  email: string = "";

  @Field((type) => Person)
  @OneToOne((_) => Person, "user")
  person?: Promise<Person>;

  @Field((type) => Role)
  @ManyToMany((_) => Role)
  @JoinTable()
  roles?: Promise<Role[]>;

  @DeleteDateColumn()
  deletedDate: Date | null = null;
}
