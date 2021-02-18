import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "@merlin-gql/core";
import { User } from "../../models/user/user.model";

@InputType()
export class UserCreateInput extends BaseInputFields implements Partial<User> {
    @Field((_) => Float)
    id: number = 0;

    @Field((_) => Date)
    created: Date = new Date();

    @Field((_) => Date, { nullable: true })
    updated?: Date;

    @Field((_) => Boolean)
    deleted: boolean = false;

    @Field((_) => String)
    username: string = "";

    @Field((_) => String)
    password: string = "";

    @Field((_) => String)
    email: string = "";

    @Field((_) => String)
    role: string = "";

    @Field((_) => Date, { nullable: true })
    deletedDate?: Date;
}

@InputType()
export class UserUpdateInput extends BaseInputFields implements Partial<User> {
    @Field((_) => Float, { nullable: true })
    id?: number;

    @Field((_) => Date, { nullable: true })
    created?: Date;

    @Field((_) => Date, { nullable: true })
    updated?: Date;

    @Field((_) => Boolean, { nullable: true })
    deleted?: boolean;

    @Field((_) => String, { nullable: true })
    username?: string;

    @Field((_) => String, { nullable: true })
    password?: string;

    @Field((_) => String, { nullable: true })
    email?: string;

    @Field((_) => String, { nullable: true })
    role?: string;

    @Field((_) => Date, { nullable: true })
    deletedDate?: Date;
}
