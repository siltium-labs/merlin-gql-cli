import { GraphQLInfo, IGqlContext } from "merlin-gql";
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Info,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { SecurityFunctions } from "../core/security/security.functions";
import { User } from "../models/user/user.model";

@ArgsType()
export class LoginCriteria {
  @Field()
  username: string = "";
  @Field()
  password: string = "";
}

@ObjectType()
class LoginResult {
  @Field((type) => User)
  user!: User;
  @Field()
  token!: string;
}

@Resolver()
export class SecurityResolver {
  @Mutation((returns) => LoginResult)
  async login(
    @Args() criteria: LoginCriteria,
    @Info() info: GraphQLInfo,
    @Ctx() context: IGqlContext
  ) {
    return SecurityFunctions.login(
      { username: criteria.username, password: criteria.password },
      info
    );
  }
}
