import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  EntityToGraphResolver,
  getInfoFromSubfield,
  GraphQLInfo,
  IDecodedToken
} from "@merlin-gql/core";
import { Arg, Field, Info, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { User } from "../../models/user/user.model";
import { getCurrentEnvironmentalConfig } from "../env/env";

@InputType()
export class LoginCredentials {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
export class LoginResult {
  @Field((_) => User, { nullable: true })
  user?: User;
  @Field()
  token!: string;
}


@Resolver()
export class SecurityFunctions {
  @Mutation((_) => LoginResult)
  async login(
    @Arg("credentials", (_) => LoginCredentials)
    credentials: LoginCredentials,
    @Info() info: GraphQLInfo,
  ): Promise<LoginResult> {
    try {
      const em = getManager();
      const username = credentials.username;
      const user = await em
        .getRepository(User)
        .createQueryBuilder("u")
        .select(["u.id", "u.username", "u.password", "u.role"])
        .where("u.username = :username", { username })
        .getOne();
      if (user) {
        const passwordIsValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (passwordIsValid) {
          const secretTokeSign = (await getCurrentEnvironmentalConfig())
            .secretToken;

          //This method gets from the info the requested subfield, in this case the user subfield, we need this in order to create the specific SQL query needed for gathering the required data from the database
          const subinfo = getInfoFromSubfield("user", info);

          const populatedUser = subinfo
            ? <User>(
              await EntityToGraphResolver.find<User>(
                user.id,
                User,
                subinfo,
                em
              )
            )
            : undefined;
          const logedUserContext = {
            id: user.id,
            username: user.username,
            roles: [user.role],
          } as IDecodedToken;
          return {
            user: populatedUser,
            token: jwt.sign(logedUserContext, secretTokeSign),
          };
        } else {
          throw "username and password do not match any existing user";
        }
      } else {
        throw "username and password do not match any existing user";
      }
    } catch (e) {
      throw e;
    }
  }
  static async decodeToken(token: string): Promise<IDecodedToken> {
    try {
      const secretTokeSign = (await getCurrentEnvironmentalConfig())
        .secretToken;
      return <IDecodedToken>jwt.verify(token, secretTokeSign);
    } catch (e) {
      throw e;
    }
  }
};
