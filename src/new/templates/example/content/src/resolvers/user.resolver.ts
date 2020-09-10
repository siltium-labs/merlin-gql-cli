import {
  CreateResolver,
  DeleteResolver,
  FindResolver,
  ListResolver,
  Secure,
  UpdateResolver,
} from "merlin-gql";
import { Resolver } from "type-graphql";
import { RolesEnum } from "../core/security/security.functions";
import { UserFilterFields } from "./../models/user/user.filters";
import { User } from "./../models/user/user.model";
import { UserSortFields } from "./../models/user/user.sort";

const BaseListResolver = ListResolver(User);
const BaseFindResolver = FindResolver(User);
const BaseCreateResolver = CreateResolver(User);
const BaseUpdateResolver = UpdateResolver(User);
const BaseDeleteResolver = DeleteResolver(User);

@Resolver()
@Secure()
export class UserListResolver extends BaseListResolver<
  User,
  UserFilterFields,
  UserSortFields
> {}

@Resolver()
export class UserFindResolver extends BaseFindResolver<User> {}
@Resolver()
export class UserUpdateResolver extends BaseUpdateResolver<User> {}
@Resolver()
export class UserCreateResolver extends BaseCreateResolver<User> {}
@Resolver()
@Secure(RolesEnum.Administrator)
export class UserDeleteResolver extends BaseDeleteResolver<User> {}
