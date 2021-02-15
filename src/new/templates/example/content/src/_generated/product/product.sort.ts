import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "merlin-gql";

import { CategorySorts } from "../category/category.sort";

@InputType()
export class ProductSorts extends BaseSortFields {
    @Field((type) => SortField, { nullable: true })
    id?: SortField;

    @Field((type) => SortField, { nullable: true })
    name?: SortField;

    @Field((type) => SortField, { nullable: true })
    price?: SortField;

    @Field((type) => SortField, { nullable: true })
    categoryId?: SortField;
}
