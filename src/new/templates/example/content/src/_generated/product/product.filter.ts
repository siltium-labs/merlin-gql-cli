import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "@merlin-gql/core";

import { CategoryFilters } from "../category/category.filter";

@InputType()
export class ProductFilters extends BaseFilterFields {
    @Field((type) => [ProductFilters], { nullable: true })
    or?: ProductFilters[];

    @Field((type) => [ProductFilters], { nullable: true })
    and?: ProductFilters[];

    @Field((type) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((type) => FilteredString, { nullable: true })
    name?: string;

    @Field((type) => FilteredFloat, { nullable: true })
    price?: number;

    @Field((type) => FilteredFloat, { nullable: true })
    categoryId?: number;

    @Field((type) => CategoryFilters, { nullable: true })
    category?: CategoryFilters;
}
