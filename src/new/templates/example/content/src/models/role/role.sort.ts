import { BaseSortFields, SortDirectionsEnum } from "merlin-gql";
import { Field, InputType } from "type-graphql";

@InputType()
export class RoleSortFields extends BaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  name?: SortDirectionsEnum;
}
