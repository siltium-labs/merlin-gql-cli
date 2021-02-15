import { Field ,NoFilter,ObjectType } from "merlin-gql";
import { Float, ID } from "type-graphql";
import { Category } from "../../models/category/category.model";

@ObjectType([
    "ALL"
])
export class CategoryOT extends Category {
    @NoFilter()
    @Field(_ => ID)
    id!: any;

    @Field(_ => String, { nullable: true })
    name!: any;
}