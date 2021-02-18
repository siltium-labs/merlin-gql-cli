import { EntityToGraphResolver, GraphQLInfo, IGqlContext, IQueryCriteria,Paginated,  createPaginationCriteria  } from "@merlin-gql/core";
import { Arg, Ctx, FieldResolver, Float, Info, InputType, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { Person } from "../models/person/person.model";
import { PersonFilters } from "../_generated/person/person.filter";
import { PersonListResolver } from "../_generated/person/person.resolver";
import { PersonSorts } from "../_generated/person/person.sort";

@Resolver(of => Person)
export class PersonExtender {
    @FieldResolver(type => String)
    uppercaseName(
        @Root() parent: Person) {
        return parent.name.toUpperCase()
    }
}

@Resolver()
export class CustomResolver {
    @Mutation(type => Float)
    sum(
        @Arg("number1") number1: number,
        @Arg("number2") number2: number
    ) {
        return number1 + number2
    }
}

@ObjectType(`PersonResult`)
class PaginatedResult extends Paginated(Person)<Person> { }

@InputType(`PersonCriteria`)
class CriteriaQuery extends createPaginationCriteria(PersonFilters, PersonSorts)<
PersonFilters,
PersonSorts
> { }

@Resolver(of => Person)
export class PersonExtendedListResolver extends PersonListResolver {
    @Query((returns) => PaginatedResult, {
        name: `PersonList`,
    })
    list(
        @Arg("criteria", (_) => CriteriaQuery, { nullable: true })
        criteriaQuery: CriteriaQuery,
        @Info() info: GraphQLInfo,
        @Ctx() context: IGqlContext
    ) {
        this.checkSecurity(context);
        console.log("Hey im overriding this!");
        let result = EntityToGraphResolver.list<Person>(
            Person,
            info,
            criteriaQuery as IQueryCriteria
        );
        return result;
    }
}
