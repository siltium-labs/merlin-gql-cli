import { Filters, Inputs, SimpleBaseModel, Sorts } from "merlin-gql";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import { RoleFilterFields } from "./role.filters";
import { RoleInput } from "./role.input";
import { RoleSortFields } from "./role.sort";

@Entity()
@ObjectType()
@Inputs(RoleInput)
@Sorts(RoleSortFields)
@Filters(RoleFilterFields)
export class Role extends SimpleBaseModel {
  @Field()
  @Column("varchar")
  name: string = "";
}
