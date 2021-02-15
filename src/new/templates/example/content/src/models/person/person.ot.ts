import { Field, NoSort, ObjectType } from "merlin-gql";
import { Float, ID } from "type-graphql";
import { Person } from "./person.model";
import { User } from "../user/user.model";

@ObjectType([
    { type: "FIND", secure: true, roles: ["admin"] },
    { type: "LIST", secure: true }
    , "CREATE", "UPDATE", "DELETE"
])
export class PersonOT extends Person {
    @Field((type) => ID)
    id!: number;

    @Field((type) => String)
    name!: string;
    
    @Field((type) => Float)
    age!: number;

    @Field((type) => Date, { nullable: true })
    @NoSort()
    deletedDate!: Date;

    @Field((type) => User, { nullable: true })
    user?: Promise<User>;
}
