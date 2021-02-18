import { MerlinGQLField, MerlinGQLResolver, NoSort } from "@merlin-gql/core";
import { Float, ID } from "type-graphql";
import { User } from "../user/user.model";
import { Person } from "./person.model";

@MerlinGQLResolver([
    { type: "FIND", secure: true, roles: ["admin"] },
    { type: "LIST", secure: true }
    , "CREATE", "UPDATE", "DELETE"
])
export class PersonResolverGenerator extends Person {
    @MerlinGQLField((_) => ID)
    id!: number;

    @MerlinGQLField((_) => String)
    name!: string;

    @MerlinGQLField((_) => Float)
    age!: number;

    @MerlinGQLField((_) => Date, { nullable: true })
    @NoSort()
    deletedDate!: Date;

    @MerlinGQLField((_) => User, { nullable: true })
    user?: Promise<User>;
}
