import { BaseSortFields, SortField } from "merlin-gql";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserSortFields extends BaseSortFields {
  @Field((type) => SortField, { nullable: true })
  username?: SortField;
}
