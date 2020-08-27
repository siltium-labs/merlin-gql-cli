import { Field, ID, InputType } from "type-graphql";
import { SortDirectionsEnum } from "../query-resolver";

@InputType()
export class BaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  id?: number;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  created?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  updated?: Date;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  deleted?: boolean;
}
