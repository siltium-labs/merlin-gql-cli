import {
  CreateResolver,
  DeleteResolver,
  FindResolver,
  ListResolver,
  Secure,
  UpdateResolver,
} from "merlin-gql";
import { Resolver, Query, FieldResolver, Root, Int } from "type-graphql";
import { Person } from "../models/person/person.model";
import { PersonSortFields } from "../models/person/person.sort";
import { PersonFilterFields } from "./../models/person/person.filters";
import { RolesEnum } from "../core/security/security.functions";

const BaseListResolver = ListResolver(Person);
const BaseFindResolver = FindResolver(Person);
const BaseCreateResolver = CreateResolver(Person);
const BaseUpdateResolver = UpdateResolver(Person);
const BaseDeleteResolver = DeleteResolver(Person);

@Resolver()
@Secure()
export class PersonListResolver extends BaseListResolver<
  Person,
  PersonFilterFields,
  PersonSortFields
> {}

@Resolver()
export class PersonFindResolver extends BaseFindResolver<Person> {
  //This resolver is as extensible and customizable as any other
  @Query((type) => String)
  foo() {
    return "bar";
  }
}
@Resolver()
export class PersonUpdateResolver extends BaseUpdateResolver<Person> {}
@Resolver()
export class PersonCreateResolver extends BaseCreateResolver<Person> {}
@Resolver()
@Secure(RolesEnum.Administrator)
export class PersonDeleteResolver extends BaseDeleteResolver<Person> {}

@Resolver((of) => Person)
export class PersonFieldsResolver {
  @FieldResolver((type) => String)
  foo(@Root() person: Person): string {
    return `${person.name} bar`;
  }

  @FieldResolver((type) => Int)
  multiplyIdBy2(@Root() person: Person): number {
    return person.id * 2;
  }
}
