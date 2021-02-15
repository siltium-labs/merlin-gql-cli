import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "merlin-gql";

import { PersonFilters } from "../person/person.filter";

@InputType()
export class UserFilters extends BaseFilterFields {
    @Field((type) => [UserFilters], { nullable: true })
    or?: UserFilters[];

    @Field((type) => [UserFilters], { nullable: true })
    and?: UserFilters[];

    @Field((type) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((type) => FilteredDate, { nullable: true })
    created?: Date;

    @Field((type) => FilteredDate, { nullable: true })
    updated?: Date;

    @Field((type) => FilteredBoolean, { nullable: true })
    deleted?: boolean;

    @Field((type) => FilteredString, { nullable: true })
    username?: string;

    @Field((type) => FilteredString, { nullable: true })
    password?: string;

    @Field((type) => FilteredString, { nullable: true })
    email?: string;

    @Field((type) => FilteredString, { nullable: true })
    role?: string;

    @Field((type) => FilteredDate, { nullable: true })
    deletedDate?: Date;

    @Field((type) => PersonFilters, { nullable: true })
    person?: PersonFilters;
}
