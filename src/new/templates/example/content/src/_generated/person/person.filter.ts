import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "@merlin-gql/core";

import { UserFilters } from "../user/user.filter";

@InputType()
export class PersonFilters extends BaseFilterFields {
    @Field((_) => [PersonFilters], { nullable: true })
    or?: PersonFilters[];

    @Field((_) => [PersonFilters], { nullable: true })
    and?: PersonFilters[];

    @Field((_) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((_) => FilteredDate, { nullable: true })
    created?: Date;

    @Field((_) => FilteredDate, { nullable: true })
    updated?: Date;

    @Field((_) => FilteredBoolean, { nullable: true })
    deleted?: boolean;

    @Field((_) => FilteredString, { nullable: true })
    name?: string;

    @Field((_) => FilteredFloat, { nullable: true })
    age?: number;

    @Field((_) => FilteredDate, { nullable: true })
    deletedDate?: Date;

    @Field((_) => UserFilters, { nullable: true })
    user?: UserFilters;
}
