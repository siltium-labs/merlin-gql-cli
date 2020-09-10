import { BaseFilterFields, BaseInputFields } from 'merlin-gql';
import { InputType, Field, Int } from "type-graphql";
import { User } from "../user/user.model";

@InputType()
export class PersonInput extends BaseInputFields {
  @Field()
  name: string = "John Doe";

  @Field((type) => Int)
  age: number = 0;

  // @Field((type) => User)
  // user?: Promise<User>;
}
