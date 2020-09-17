import { BaseSortFields, SortField } from "./base-sort-fields";
import { Field, InputType } from "type-graphql";


@InputType({ isAbstract: true })
export class SimpleBaseSortFields extends BaseSortFields {
  @Field((type) => SortField, { nullable: true })
  id?: SortField;

  @Field((type) => SortField, { nullable: true })
  created?: SortField;

  @Field((type) => SortField, { nullable: true })
  updated?: SortField;

  @Field((type) => SortField, { nullable: true })
  deleted?: SortField;
}
