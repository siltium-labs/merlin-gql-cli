import { BaseFilterFields } from "merlin-gql";
import FilterField from "merlin-gql/lib/core/type-graphql/resolvers/filter-field";
import { Field, InputType } from "type-graphql";

@InputType()
class FilteredRoleName extends FilterField(String) {}

@InputType()
export class RoleFilterFields extends BaseFilterFields {
  @Field((type) => FilteredRoleName, { nullable: true })
  name?: FilteredRoleName;
}
