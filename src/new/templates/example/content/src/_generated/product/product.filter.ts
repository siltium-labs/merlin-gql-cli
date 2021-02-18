import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "@merlin-gql/core";

import { CategoryFilters } from "../category/category.filter";

@InputType()
export class ProductFilters extends BaseFilterFields {
    @Field((_) => [ProductFilters], { nullable: true })
    or?: ProductFilters[];

    @Field((_) => [ProductFilters], { nullable: true })
    and?: ProductFilters[];

    @Field((_) => FilteredFloat, { nullable: true })
    id?: number;

    @Field((_) => FilteredString, { nullable: true })
    name?: string;

    @Field((_) => FilteredFloat, { nullable: true })
    price?: number;

    @Field((_) => FilteredFloat, { nullable: true })
    categoryId?: number;

    @Field((_) => CategoryFilters, { nullable: true })
    category?: CategoryFilters;
}
