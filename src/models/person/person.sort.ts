import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "merlin-gql";

@InputType()
export class PersonSorts extends BaseSortFields {
    @Field((type) => SortField, { nullable: true })
    id?: SortField;
    @Field((type) => SortField, { nullable: true })
    created?: SortField;
    @Field((type) => SortField, { nullable: true })
    updated?: SortField;
    @Field((type) => SortField, { nullable: true })
    deleted?: SortField;
    @Field((type) => SortField, { nullable: true })
    name?: SortField;
    @Field((type) => SortField, { nullable: true })
    age?: SortField;
    @Field((type) => SortField, { nullable: true })
    userId?: SortField;
    @Field((type) => SortField, { nullable: true })
    deletedDate?: SortField;
    @Field((type) => UserSorts, { nullable: true })
    user?: Promise<UserSorts>;
}
