import { Field ,NoFilter,NoSort,ObjectType } from "merlin-gql";
import { Float, ID, Int } from "type-graphql";
import { Product } from "../../models/product/product.model";
import { Category } from "../category/category.model";

@ObjectType([
    "ALL"
])
export class ProductOT extends Product {
    
    @Field(_ => ID)
    id!: any;
    
    @Field(_ => String, { nullable: true })
    name!: any;

    @Field(_ => Float)
    price!: any;

    @NoSort()
    @Field(_ => Category)
    category!:any;

    @Field(_ => Int)
    categoryId!:any;
}