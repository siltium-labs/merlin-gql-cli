import { BaseInputFields } from "merlin-gql";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class UserInput extends BaseInputFields {
  @Field()
  username: string = "";

  @Field()
  password: string = "";

  // @Field((type) => User)
  // user?: Promise<User>;
}
