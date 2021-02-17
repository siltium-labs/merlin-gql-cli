import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "@merlin-gql/core";
import { Category } from "../../models/category/category.model";

@InputType()
export class CategoryCreateInput extends BaseInputFields implements Partial<Category> {
    @Field((type) => Float)
    id: number = 0;

    @Field((type) => String, { nullable: true })
    name?: string;
}

@InputType()
export class CategoryUpdateInput extends BaseInputFields implements Partial<Category> {
    @Field((type) => Float, { nullable: true })
    id?: number;

    @Field((type) => String, { nullable: true })
    name?: string;
}
