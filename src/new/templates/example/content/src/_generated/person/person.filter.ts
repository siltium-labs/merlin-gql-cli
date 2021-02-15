import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "merlin-gql";

import { UserFilters } from "../user/user.filter";

@InputType()
export class PersonFilters extends BaseFilterFields {
    @Field((type) => [PersonFilters], { nullable: true })
    or?: PersonFilters[];

    @Field((type) => [PersonFilters], { nullable: true })
    and?: PersonFilters[];

    @Field((type) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((type) => FilteredDate, { nullable: true })
    created?: Date;

    @Field((type) => FilteredDate, { nullable: true })
    updated?: Date;

    @Field((type) => FilteredBoolean, { nullable: true })
    deleted?: boolean;

    @Field((type) => FilteredString, { nullable: true })
    name?: string;

    @Field((type) => FilteredFloat, { nullable: true })
    age?: number;

    @Field((type) => FilteredDate, { nullable: true })
    deletedDate?: Date;

    @Field((type) => UserFilters, { nullable: true })
    user?: UserFilters;
}
