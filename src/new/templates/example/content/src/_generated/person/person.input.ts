import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "merlin-gql";
import { Person } from "../../models/person/person.model";

@InputType()
export class PersonCreateInput extends BaseInputFields implements Partial<Person> {
    @Field((type) => Float)
    id: number = 0;

    @Field((type) => Date)
    created: Date = new Date();

    @Field((type) => Date, { nullable: true })
    updated?: Date;

    @Field((type) => Boolean)
    deleted: boolean = false;

    @Field((type) => String)
    name: string = "";

    @Field((type) => Float)
    age: number = 0;

    @Field((type) => Date, { nullable: true })
    deletedDate?: Date;
}

@InputType()
export class PersonUpdateInput extends BaseInputFields implements Partial<Person> {
    @Field((type) => Float, { nullable: true })
    id?: number;

    @Field((type) => Date, { nullable: true })
    created?: Date;

    @Field((type) => Date, { nullable: true })
    updated?: Date;

    @Field((type) => Boolean, { nullable: true })
    deleted?: boolean;

    @Field((type) => String, { nullable: true })
    name?: string;

    @Field((type) => Float, { nullable: true })
    age?: number;

    @Field((type) => Date, { nullable: true })
    deletedDate?: Date;
}
