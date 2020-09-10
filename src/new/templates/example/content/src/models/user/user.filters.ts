import { BaseFilterFields } from "merlin-gql";
import FilterField from "merlin-gql/lib/core/type-graphql/resolvers/filter-field";
import { Field, InputType } from "type-graphql";

@InputType()
class FilteredUserUsername extends FilterField(String) {}

@InputType()
export class UserFilterFields extends BaseFilterFields {
  @Field((type) => FilteredUserUsername, { nullable: true })
  username?: FilteredUserUsername;
}
