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
    id!: any;

    @MerlinGQLField((_) => String)
    name!: any;

    @MerlinGQLField((_) => Float)
    age!: any;

    @MerlinGQLField((_) => Date, { nullable: true })
    @NoSort()
    deletedDate!: any;

    @MerlinGQLField((_) => User, { nullable: true })
    user!: any;
}
