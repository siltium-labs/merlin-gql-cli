import { MerlinGQLField, MerlinGQLResolver, NoSort } from "@merlin-gql/core";
import { Float, ID, Int } from "type-graphql";
import { Product } from "./product.model";
import { Category } from "../category/category.model";

@MerlinGQLResolver([
    "ALL"
])
export class ProductResolverGenerator extends Product {

    @MerlinGQLField(_ => ID)
    id!: any;

    @MerlinGQLField(_ => String, { nullable: true })
    name!: any;

    @MerlinGQLField(_ => Float)
    price!: any;

    @NoSort()
    @MerlinGQLField(_ => Category)
    category!:any;

    @MerlinGQLField(_ => Int)
    categoryId!:any;
}
