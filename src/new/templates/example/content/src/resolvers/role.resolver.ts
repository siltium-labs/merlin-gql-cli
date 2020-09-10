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
import { RoleFilterFields } from "../models/role/role.filters";
import { RoleSortFields } from "../models/role/role.sort";
import { Role } from "./../models/role/role.model";

const BaseListResolver = ListResolver(Role);
const BaseFindResolver = FindResolver(Role);
const BaseCreateResolver = CreateResolver(Role);
const BaseUpdateResolver = UpdateResolver(Role);
const BaseDeleteResolver = DeleteResolver(Role);

@Resolver()
@Secure()
export class RoleListResolver extends BaseListResolver<
  Role,
  RoleFilterFields,
  RoleSortFields
> {}

@Resolver()
export class RoleFindResolver extends BaseFindResolver<Role> {}
@Resolver()
export class RoleUpdateResolver extends BaseUpdateResolver<Role> {}
@Resolver()
export class RoleCreateResolver extends BaseCreateResolver<Role> {}
@Resolver()
@Secure(RolesEnum.Administrator)
export class RoleDeleteResolver extends BaseDeleteResolver<Role> {}
