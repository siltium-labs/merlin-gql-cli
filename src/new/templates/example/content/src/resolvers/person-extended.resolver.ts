import { FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Person } from "../models/person/person.model";

//You can extend any of the Person resolver classes if you want to override a method
@Resolver()
export class PersonExtenderResolver {
  //This resolver is as extensible and customizable as any other
  @Query((type) => String)
  foo() {
    return "bar";
  }
}

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
