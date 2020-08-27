import { SecurityFunctions, RolesEnum } from "./security.functions";
import { GqlContext } from "../context";
import {
  getMetadataStorage,
  ClassType,
  createMethodDecorator,
} from "type-graphql";

export function Secure() {
  return createMethodDecorator(
    async ({ context }: { context: GqlContext }, next) => {
      SecurityFunctions.mustBeAuthenticated(context);
      return next();
    }
  );
}

export function MustHaveRoles(...roles: RolesEnum[]) {
  return createMethodDecorator(
    async ({ context }: { context: GqlContext }, next) => {
      SecurityFunctions.mustHaveRole(context, ...roles);
      return next();
    }
  );
}
