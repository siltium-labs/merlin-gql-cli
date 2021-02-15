import { Field, ObjectType, Secure } from "merlin-gql";
import { ID } from "type-graphql";
import { Person } from "../person/person.model";
import { RolesEnum, User } from "./user.model";

@Secure()
@ObjectType(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class UserOT extends User {
    @Field((type) => ID)
    id!: number;

    @Field((type) => String)
    username!: string;

    @Field((type) => String)
    password!: string;

    @Field((type) => String)
    email!: string;

    @Field((type) => Date, { nullable: true })
    deletedDate!: Date;

    @Field((type) => RolesEnum)
    role!: string;

    @Field((type) => Person, { nullable: true })
    person?: Promise<Person>;
}
