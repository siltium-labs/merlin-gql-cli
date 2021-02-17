import { InputType, Field } from "type-graphql";
import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "@merlin-gql/core";

import { ProductFilters } from "../product/product.filter";

@InputType()
export class CategoryFilters extends BaseFilterFields {
    @Field((type) => [CategoryFilters], { nullable: true })
    or?: CategoryFilters[];

    @Field((type) => [CategoryFilters], { nullable: true })
    and?: CategoryFilters[];

    @Field((type) => FilteredString, { nullable: true })
    name?: string;
}
