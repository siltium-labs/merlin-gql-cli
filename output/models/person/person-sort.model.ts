import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortDirectionsEnum } from "merlin-gql";

@InputType()
export class PersonSorts extends BaseSortFields {
    @Field((type) => SortDirectionsEnum, { nullable: true })
    id?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    created?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    updated?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    deleted?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    name?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    age?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    userId?: SortDirectionsEnum;
    @Field((type) => SortDirectionsEnum, { nullable: true })
    deletedDate?: SortDirectionsEnum;
    @Field((type) => UserSorts, { nullable: true })
    user?: Promise<UserSorts>;
}
