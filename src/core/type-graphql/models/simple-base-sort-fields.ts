import { BaseSortFields } from "./base-sort-fields";
import { Field, InputType } from "type-graphql";
import { SortDirectionsEnum } from "../resolvers/query-resolver";

@InputType({ isAbstract: true })
export class SimpleBaseSortFields extends BaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  id?: number;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  created?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  updated?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  deleted?: boolean;
}
