import { MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Person } from "../person/person.model";
import { RolesEnum, User } from "./user.model";

@MerlinGQLResolver(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class UserResolverGenerator extends User {
    @MerlinGQLField((_) => ID)
    id!: any;

    @MerlinGQLField((_) => String)
    username!: any;

    @MerlinGQLField((_) => String)
    password!: any;

    @MerlinGQLField((_) => String)
    email!: any;

    @MerlinGQLField((_) => Date, { nullable: true })
    deletedDate!: any;

    @MerlinGQLField((_) => RolesEnum)
    role!: any;

    @MerlinGQLField((_) => Person, { nullable: true })
    person?: any;
}
