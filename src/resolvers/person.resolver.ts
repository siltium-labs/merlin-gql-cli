import { Resolver } from "type-graphql";
import { Person } from "../models/person/person.model";
import { PersonFilters } from "../models/person/person.filter";
import { PersonSorts } from "../models/person/person.sort";
import { CreateResolver, DeleteResolver, FindResolver, ListResolver, UpdateResolver } from "merlin-gql";

const BaseListResolver = ListResolver(Person);
const BaseFindResolver = FindResolver(Person);
const BaseCreateResolver = CreateResolver(Person);
const BaseUpdateResolver = UpdateResolver(Person);
const BaseDeleteResolver = DeleteResolver(Person);

@Resolver()
export class PersonListResolver extends BaseListResolver<Person, PersonFilters, PersonSorts> {}

@Resolver()
export class PersonFindResolver extends BaseFindResolver<Person> {}

@Resolver()
export class PersonUpdateResolver extends BaseUpdateResolver<Person> {}

@Resolver()
export class PersonCreateResolver extends BaseCreateResolver<Person> {}

@Resolver()
export class PersonDeleteResolver extends BaseDeleteResolver<Person> {}
