import { MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Person } from "../person/person.model";
import { RolesEnum, User } from "./user.model";

@MerlinGQLResolver(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class UserResolverGenerator extends User {
    @MerlinGQLField((_) => ID)
    id!: number;

    @MerlinGQLField((_) => String)
    username!: string;

    @MerlinGQLField((_) => String)
    password!: string;

    @MerlinGQLField((_) => String)
    email!: string;

    @MerlinGQLField((_) => Date, { nullable: true })
    deletedDate!: Date;

    @MerlinGQLField((_) => RolesEnum)
    role!: string;

    @MerlinGQLField((_) => Person, { nullable: true })
    person?: Promise<Person>;
}
