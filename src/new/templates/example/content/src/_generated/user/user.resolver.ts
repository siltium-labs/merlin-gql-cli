import { Resolver } from "type-graphql";
import { User } from "../../models/user/user.model";

import { UserFilters } from "./user.filter";
import { UserSorts } from "./user.sort";

import { UserCreateInput, UserUpdateInput } from "./user.input";

import { ListResolver, FindResolver, UpdateResolver, CreateResolver, DeleteResolver } from "merlin-gql";

const BaseListResolver = ListResolver(User, UserFilters, UserSorts);
@Resolver()
export class UserListResolver extends BaseListResolver<User, UserFilters, UserSorts> {}

const BaseFindResolver = FindResolver(User);
@Resolver()
export class UserFindResolver extends BaseFindResolver<User> {}

const BaseUpdateResolver = UpdateResolver(User, UserUpdateInput);
@Resolver()
export class UserUpdateResolver extends BaseUpdateResolver<User> {}

const BaseCreateResolver = CreateResolver(User, UserCreateInput);
@Resolver()
export class UserCreateResolver extends BaseCreateResolver<User> {}

const BaseDeleteResolver = DeleteResolver(User);
@Resolver()
export class UserDeleteResolver extends BaseDeleteResolver<User> {}
