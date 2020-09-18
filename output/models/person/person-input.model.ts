import { InputType, Field } from "type-graphql";
import { BaseInputFields } from "merlin-gql";
import { Person } from "./person.model";

@InputType()
export class PersonInputs extends BaseInputFields implements Partial<Person> {
    @Field()
    id: string = "";
    @Field()
    created: Date = new Date();
    @Field({ nullable: true })
    updated?: Date;
    @Field()
    deleted: boolean = false;
    @Field()
    name: string = "";
    @Field()
    age: number = 0;
    @Field({ nullable: true })
    userId?: number;
    @Field({ nullable: true })
    deletedDate?: Date;
}
