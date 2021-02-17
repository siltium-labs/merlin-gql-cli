import { Resolver } from "type-graphql";
import { Person } from "../../models/person/person.model";

import { PersonFilters } from "./person.filter";
import { PersonSorts } from "./person.sort";

import { PersonCreateInput, PersonUpdateInput } from "./person.input";

import { ListResolver, FindResolver, UpdateResolver, CreateResolver, DeleteResolver, Secure } from "@merlin-gql/core";

const BaseListResolver = ListResolver(Person, PersonFilters, PersonSorts);
@Resolver()
@Secure()
export class PersonListResolver extends BaseListResolver<Person, PersonFilters, PersonSorts> {}

const BaseFindResolver = FindResolver(Person);
@Resolver()
@Secure("admin")
export class PersonFindResolver extends BaseFindResolver<Person> {}

const BaseUpdateResolver = UpdateResolver(Person, PersonUpdateInput);
@Resolver()
export class PersonUpdateResolver extends BaseUpdateResolver<Person> {}

const BaseCreateResolver = CreateResolver(Person, PersonCreateInput);
@Resolver()
export class PersonCreateResolver extends BaseCreateResolver<Person> {}

const BaseDeleteResolver = DeleteResolver(Person);
@Resolver()
export class PersonDeleteResolver extends BaseDeleteResolver<Person> {}
