
import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "merlin-gql";


@InputType()
export class PersonSortFields extends BaseSortFields {
  @Field((type) => SortField, { nullable: true })
  name?: SortField;

  @Field((type) => SortField, { nullable: true })
  age?: SortField;
}
