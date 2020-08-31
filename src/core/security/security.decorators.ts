import { GqlContext, IGqlContext } from "../context";
import {
  getMetadataStorage,
  ClassType,
  createMethodDecorator,
} from "type-graphql";
import { AuthenticationError } from "apollo-server";

export const mustBeAuthenticated = (context: IGqlContext) => {
  if (!context.user) {
    throw new AuthenticationError("Must provide credentials");
  }
};
export const mustHaveRole = (context: IGqlContext, ...roles: string[]) => {
  if (!roles.includes(context.user.role)) {
    throw new AuthenticationError(`Must be ${roles}`);
  }
};

export function Secure() {
  return createMethodDecorator(
    async ({ context }: { context: GqlContext }, next) => {
      mustBeAuthenticated(context);
      return next();
    }
  );
}

export function MustHaveRoles(...roles: string[]) {
  return createMethodDecorator(
    async ({ context }: { context: GqlContext }, next) => {
      mustHaveRole(context, ...roles);
      return next();
    }
  );
}
