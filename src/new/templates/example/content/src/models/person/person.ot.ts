import { MerlinGQLField, MerlinGQLResolver, NoSort } from "merlin-gql";
import { Float, ID } from "type-graphql";
import { User } from "../user/user.model";
import { Person } from "./person.model";

@MerlinGQLResolver([
    { type: "FIND", secure: true, roles: ["admin"] },
    { type: "LIST", secure: true }
    , "CREATE", "UPDATE", "DELETE"
])
export class PersonOT extends Person {
    @MerlinGQLField((type) => ID)
    id!: number;

    @MerlinGQLField((type) => String)
    name!: string;
    
    @MerlinGQLField((type) => Float)
    age!: number;

    @MerlinGQLField((type) => Date, { nullable: true })
    @NoSort()
    deletedDate!: Date;

    @MerlinGQLField((type) => User, { nullable: true })
    user?: Promise<User>;
}
