import { Field, ID, InputType, ClassType } from "type-graphql";
import { FilteredString, FilteredID } from "./filter-field";

@InputType()
export class BaseFilterFields {
  @Field((type) => FilteredID, { nullable: true })
  id?: number;

  @Field((type) => FilteredString, { nullable: true })
  created?: Date;

  @Field((type) => FilteredString, { nullable: true })
  updated?: Date;

  @Field((type) => FilteredString, { nullable: true })
  deleted?: boolean;
}
