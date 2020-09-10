import { BaseFilterFields } from "merlin-gql";
import FilterField from "merlin-gql/lib/core/type-graphql/resolvers/filter-field";
import { Field, InputType, Int } from "type-graphql";

@InputType()
class FilteredPersonName extends FilterField(String) {}

@InputType()
class FilteredPersonAge extends FilterField(Int) {}

@InputType()
export class PersonFilterFields extends BaseFilterFields {
  @Field((type) => FilteredPersonName, { nullable: true })
  name?: FilteredPersonName;

  @Field((type) => FilteredPersonAge, { nullable: true })
  age?: FilteredPersonAge;

  @Field((type) => [PersonFilterFields], { nullable: true })
  or?: PersonFilterFields[];

  @Field((type) => [PersonFilterFields], { nullable: true })
  and?: PersonFilterFields[];
}
