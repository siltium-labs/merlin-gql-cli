import { Field, MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Category } from "../../models/category/category.model";

@MerlinGQLResolver([
    "ALL"
])
export class CategoryOT extends Category {
    @MerlinGQLField()
    @Field(_ => ID)
    id!: any;

    @MerlinGQLField(_ => String, { nullable: true })
    name!: any;
}
