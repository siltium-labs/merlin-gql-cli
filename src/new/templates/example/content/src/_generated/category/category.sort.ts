import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "@merlin-gql/core";

import { ProductSorts } from "../product/product.sort";

@InputType()
export class CategorySorts extends BaseSortFields {
    @Field((_) => SortField, { nullable: true })
    id?: SortField;

    @Field((_) => SortField, { nullable: true })
    name?: SortField;
}
