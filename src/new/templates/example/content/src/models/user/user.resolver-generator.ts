import { MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Person } from "../person/person.model";
import { RolesEnum, User } from "./user.model";

@MerlinGQLResolver(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class UserResolverGenerator extends User {
    @MerlinGQLField((type) => ID)
    id!: number;

    @MerlinGQLField((type) => String)
    username!: string;

    @MerlinGQLField((type) => String)
    password!: string;

    @MerlinGQLField((type) => String)
    email!: string;

    @MerlinGQLField((type) => Date, { nullable: true })
    deletedDate!: Date;

    @MerlinGQLField((type) => RolesEnum)
    role!: string;

    @MerlinGQLField((type) => Person, { nullable: true })
    person?: Promise<Person>;
}
