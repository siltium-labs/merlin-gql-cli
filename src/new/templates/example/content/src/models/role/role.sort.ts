import { BaseSortFields, SortField } from "merlin-gql";
import { Field, InputType } from "type-graphql";

@InputType()
export class RoleSortFields extends BaseSortFields {
  @Field((type) => SortField, { nullable: true })
  name?: SortField;
}
