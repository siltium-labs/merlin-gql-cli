import { GqlContext, IGqlContext } from "../context";
import {
  getMetadataStorage,
  ClassType,
  createMethodDecorator,
} from "type-graphql";
import { AuthenticationError } from "apollo-server";

const someElementMatches = (arr1: string[], arr2: string[]) => {
  const matches = arr1.some((el) => arr2.includes(el));
  return matches;
};

export const mustBeAuthenticated = (context: IGqlContext) => {
  if (!context.user) {
    throw new AuthenticationError("Must provide credentials");
  }
};
export const mustHaveRole = (context: IGqlContext, ...roles: string[]) => {
  if (!someElementMatches(roles, context.user?.roles ?? [])) {
    throw new AuthenticationError(`Must be ${roles}`);
  }
};

export function MustHaveRoles(...roles: string[]) {
  return createMethodDecorator(
    async ({ context }: { context: GqlContext }, next) => {
      mustHaveRole(context, ...roles);
      return next();
    }
  );
}
