import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "merlin-gql";

import { PersonSorts } from "../person/person.sort";

@InputType()
export class UserSorts extends BaseSortFields {
    @Field((type) => SortField, { nullable: true })
    id?: SortField;

    @Field((type) => SortField, { nullable: true })
    created?: SortField;

    @Field((type) => SortField, { nullable: true })
    updated?: SortField;

    @Field((type) => SortField, { nullable: true })
    deleted?: SortField;

    @Field((type) => SortField, { nullable: true })
    username?: SortField;

    @Field((type) => SortField, { nullable: true })
    password?: SortField;

    @Field((type) => SortField, { nullable: true })
    email?: SortField;

    @Field((type) => SortField, { nullable: true })
    role?: SortField;

    @Field((type) => SortField, { nullable: true })
    deletedDate?: SortField;

    @Field((type) => PersonSorts, { nullable: true })
    person?: PersonSorts;
}
