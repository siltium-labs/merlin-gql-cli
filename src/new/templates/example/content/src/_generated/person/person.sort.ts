import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "@merlin-gql/core";

import { UserSorts } from "../user/user.sort";

@InputType()
export class PersonSorts extends BaseSortFields {
    @Field((_) => SortField, { nullable: true })
    id?: SortField;

    @Field((_) => SortField, { nullable: true })
    created?: SortField;

    @Field((_) => SortField, { nullable: true })
    updated?: SortField;

    @Field((_) => SortField, { nullable: true })
    deleted?: SortField;

    @Field((_) => SortField, { nullable: true })
    name?: SortField;

    @Field((_) => SortField, { nullable: true })
    age?: SortField;

    @Field((_) => UserSorts, { nullable: true })
    user?: UserSorts;
}
