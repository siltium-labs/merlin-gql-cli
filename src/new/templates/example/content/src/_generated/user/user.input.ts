import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "merlin-gql";
import { User } from "../../models/user/user.model";

@InputType()
export class UserCreateInput extends BaseInputFields implements Partial<User> {
    @Field((type) => Float)
    id: number = 0;

    @Field((type) => Date)
    created: Date = new Date();

    @Field((type) => Date, { nullable: true })
    updated?: Date;

    @Field((type) => Boolean)
    deleted: boolean = false;

    @Field((type) => String)
    username: string = "";

    @Field((type) => String)
    password: string = "";

    @Field((type) => String)
    email: string = "";

    @Field((type) => String)
    role: string = "";

    @Field((type) => Date, { nullable: true })
    deletedDate?: Date;
}

@InputType()
export class UserUpdateInput extends BaseInputFields implements Partial<User> {
    @Field((type) => Float, { nullable: true })
    id?: number;

    @Field((type) => Date, { nullable: true })
    created?: Date;

    @Field((type) => Date, { nullable: true })
    updated?: Date;

    @Field((type) => Boolean, { nullable: true })
    deleted?: boolean;

    @Field((type) => String, { nullable: true })
    username?: string;

    @Field((type) => String, { nullable: true })
    password?: string;

    @Field((type) => String, { nullable: true })
    email?: string;

    @Field((type) => String, { nullable: true })
    role?: string;

    @Field((type) => Date, { nullable: true })
    deletedDate?: Date;
}
