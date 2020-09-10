import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  EntityToGraphResolver,
  getInfoFromSubfield,
  GraphQLInfo,
  IDecodedToken,
} from "merlin-gql";
import { getManager } from "typeorm";
import { User } from "../../models/user/user.model";
import { getCurrentEnvironmentalConfig } from "../env/env";

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResult {
  user?: User;
  token: string;
}

export enum RolesEnum {
  Anonymous = "anonymous",
  User = "User",
  Administrator = "administrator",
}

export const SecurityFunctions = {
  login: async (
    data: ILoginRequest,
    info: GraphQLInfo
  ): Promise<ILoginResult> => {
    try {
      const em = getManager();
      const username = data.username;
      const user = await em
        .getRepository(User)
        .createQueryBuilder("u")
        .select(["u.id", "u.username", "u.password", "r.name"])
        .leftJoinAndSelect("u.roles", "r")
        .where("u.username = :username", { username })
        .getOne();
      if (user) {
        const passwordIsValid = await bcrypt.compare(
          data.password,
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
            roles: (await user.roles)?.map((r) => r.name),
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
  },
  decodeToken: async (token: string): Promise<IDecodedToken> => {
    try {
      const secretTokeSign = (await getCurrentEnvironmentalConfig())
        .secretToken;
      return <IDecodedToken>jwt.verify(token, secretTokeSign);
    } catch (e) {
      throw e;
    }
  },
};
