import { Field, InputType } from "type-graphql";
import { SortDirectionsEnum } from "../resolvers/query-resolver";

@InputType()
export class SimpleBaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  id?: number;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  created?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  updated?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  deleted?: boolean;
}
