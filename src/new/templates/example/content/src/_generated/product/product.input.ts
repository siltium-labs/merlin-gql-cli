import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "@merlin-gql/core";
import { Product } from "../../models/product/product.model";

@InputType()
export class ProductCreateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => Float)
    id: number = 0;

    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float)
    price: number = 0;

    @Field((_) => Float, { nullable: true })
    categoryId?: number;
}

@InputType()
export class ProductUpdateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => Float, { nullable: true })
    id?: number;

    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float, { nullable: true })
    price?: number;

    @Field((_) => Float, { nullable: true })
    categoryId?: number;
}
