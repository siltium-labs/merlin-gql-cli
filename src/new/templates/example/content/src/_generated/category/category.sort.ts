import { InputType, Field } from "type-graphql";
import { BaseSortFields, SortField } from "merlin-gql";

import { ProductSorts } from "../product/product.sort";

@InputType()
export class CategorySorts extends BaseSortFields {
    @Field((type) => SortField, { nullable: true })
    id?: SortField;

    @Field((type) => SortField, { nullable: true })
    name?: SortField;
}
