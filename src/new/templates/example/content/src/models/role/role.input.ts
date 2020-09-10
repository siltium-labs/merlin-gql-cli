import { BaseInputFields } from "merlin-gql";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RoleInput extends BaseInputFields {
  @Field()
  name: string = "";

  // @Field((type) => User)
  // user?: Promise<User>;
}
