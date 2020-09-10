
import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortDirectionsEnum } from "merlin-gql";


@InputType()
export class PersonSortFields extends BaseSortFields {
  @Field((type) => SortDirectionsEnum, { nullable: true })
  name?: SortDirectionsEnum;

  @Field((type) => SortDirectionsEnum, { nullable: true })
  age?: SortDirectionsEnum;
}
