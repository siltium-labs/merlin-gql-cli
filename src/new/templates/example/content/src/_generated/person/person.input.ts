import { InputType, Field, Float, ID } from "type-graphql";
import { BaseInputFields } from "@merlin-gql/core";
import { Person } from "../../models/person/person.model";

@InputType()
export class PersonCreateInput extends BaseInputFields implements Partial<Person> {
    @Field((_) => Float)
    id: number = 0;

    @Field((_) => Date)
    created: Date = new Date();

    @Field((_) => Date, { nullable: true })
    updated?: Date;

    @Field((_) => Boolean)
    deleted: boolean = false;

    @Field((_) => String)
    name: string = "";

    @Field((_) => Float)
    age: number = 0;

    @Field((_) => Date, { nullable: true })
    deletedDate?: Date;
}

@InputType()
export class PersonUpdateInput extends BaseInputFields implements Partial<Person> {
    @Field((_) => Float, { nullable: true })
    id?: number;

    @Field((_) => Date, { nullable: true })
    created?: Date;

    @Field((_) => Date, { nullable: true })
    updated?: Date;

    @Field((_) => Boolean, { nullable: true })
    deleted?: boolean;

    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float, { nullable: true })
    age?: number;

    @Field((_) => Date, { nullable: true })
    deletedDate?: Date;
}
