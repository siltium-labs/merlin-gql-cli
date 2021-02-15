import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "merlin-gql";
import { Product } from "../../models/product/product.model";

@InputType()
export class ProductCreateInput extends BaseInputFields implements Partial<Product> {
    @Field((type) => Float)
    id: number = 0;

    @Field((type) => String, { nullable: true })
    name?: string;

    @Field((type) => Float)
    price: number = 0;

    @Field((type) => Float, { nullable: true })
    categoryId?: number;
}

@InputType()
export class ProductUpdateInput extends BaseInputFields implements Partial<Product> {
    @Field((type) => Float, { nullable: true })
    id?: number;

    @Field((type) => String, { nullable: true })
    name?: string;

    @Field((type) => Float, { nullable: true })
    price?: number;

    @Field((type) => Float, { nullable: true })
    categoryId?: number;
}
