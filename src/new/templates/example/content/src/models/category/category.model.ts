import { BaseModel } from "@merlin-gql/core";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.model";


@Entity()
export class Category extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column("varchar", { nullable: true })
    name: string | null = null;

    @OneToMany((_) => Product, "category")
    products?: Promise<Product[]>;
}
