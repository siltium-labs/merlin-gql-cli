import { Field, MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Category } from "./category.model";

@MerlinGQLResolver([
    "ALL"
])
export class CategoryResolverGenerator extends Category {
    @MerlinGQLField()
    @Field(_ => ID)
    id!: any;

    @MerlinGQLField(_ => String, { nullable: true })
    name!: any;
}
