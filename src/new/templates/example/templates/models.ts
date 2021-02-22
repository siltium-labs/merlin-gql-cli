import { TypeormDatabaseTypes } from "../../../../commands/new";
import { NewTemplateUtils } from "../../new-templates.utils.ts/new-templates.utils";


export const PersonModelTemplate = (databaseType: TypeormDatabaseTypes): string => {
    return `
    import { Column, Entity, JoinColumn, OneToOne, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
    import { BaseModel } from "@merlin-gql/core";
    import { User } from "../user/user.model";

    @Entity()
    export class Person extends BaseModel {

        @PrimaryGeneratedColumn()
        id: number = 0;

        @Column("${NewTemplateUtils.textType(databaseType)}")
        name: string = "";

        @Column("${NewTemplateUtils.intType(databaseType)}")
        age: number = 0;

        @DeleteDateColumn()
        deletedDate: Date | null = null;

        @OneToOne(() => User, (user) => user.person)
        @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
        user?: Promise<User>;
    }
        `;
};

export const CategoryModelTemplate = (databaseType: TypeormDatabaseTypes): string => {
    return `
import { BaseModel } from "@merlin-gql/core";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.model";


@Entity()
export class Category extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column("${NewTemplateUtils.textType(databaseType)}", { nullable: true })
    name: string | null = null;

    @OneToMany((_) => Product, "category")
    products?: Promise<Product[]>;
}
        `;
};

export const ProductModelTemplate = (databaseType: TypeormDatabaseTypes): string => {
    return `
    import { BaseModel } from "@merlin-gql/core";
    import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
    import { Category } from "../category/category.model";
    
    @Entity()
    export class Product extends BaseModel {
        @PrimaryGeneratedColumn()
        id: number = 0;
    
        @Column("${NewTemplateUtils.textType(databaseType)}", { nullable: true })
        name: string | null = null;
    
        @Column("${NewTemplateUtils.numberWithDecimalsType(databaseType)}")
        price: number = 0;
    
        @ManyToOne((_) => Category, "products")
        @JoinColumn({ name: "category_id" })
        category?: Promise<Category>;
    
        @Column("${NewTemplateUtils.intType(databaseType)}", { nullable: true })
        categoryId: number | null = null;
    }
        `;
};

export const UserModelTemplate = (databaseType: TypeormDatabaseTypes): string => {
    return `
    import { BaseModel } from "@merlin-gql/core";
    import { registerEnumType } from "type-graphql";
    import { Column, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
    import { Person } from "../person/person.model";
    
    
    export enum RolesEnum {
        Admin = "admin",
        User = "user"
    }
    
    registerEnumType(RolesEnum, {
        name: "Roles"
    });
    
    @Entity()
    export class User extends BaseModel {
    
        @PrimaryGeneratedColumn()
        id: number = 0;
    
        @Column("${NewTemplateUtils.textType(databaseType)}")
        username: string = "";
    
        @Column("${NewTemplateUtils.textType(databaseType)}")
        password: string = "";
    
        @Column("${NewTemplateUtils.textType(databaseType)}")
        email: string = "";
    
        @Column("${NewTemplateUtils.textType(databaseType)}")
        role: string = RolesEnum.User;
    
        @DeleteDateColumn()
        deletedDate: Date | null = null;
    
        @OneToOne(() => Person, (person) => person.user)
        person?: Promise<Person>;
    }
        `;
};
