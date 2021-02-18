import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "@merlin-gql/core";

import { PersonFilters } from "../person/person.filter";

@InputType()
export class UserFilters extends BaseFilterFields {
    @Field((_) => [UserFilters], { nullable: true })
    or?: UserFilters[];

    @Field((_) => [UserFilters], { nullable: true })
    and?: UserFilters[];

    @Field((_) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((_) => FilteredDate, { nullable: true })
    created?: Date;

    @Field((_) => FilteredDate, { nullable: true })
    updated?: Date;

    @Field((_) => FilteredBoolean, { nullable: true })
    deleted?: boolean;

    @Field((_) => FilteredString, { nullable: true })
    username?: string;

    @Field((_) => FilteredString, { nullable: true })
    password?: string;

    @Field((_) => FilteredString, { nullable: true })
    email?: string;

    @Field((_) => FilteredString, { nullable: true })
    role?: string;

    @Field((_) => FilteredDate, { nullable: true })
    deletedDate?: Date;

    @Field((_) => PersonFilters, { nullable: true })
    person?: PersonFilters;
}
