import { BaseSortFields, SortDirectionsEnum } from "merlin-gql";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserSortFields extends BaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  username?: SortDirectionsEnum;
}
