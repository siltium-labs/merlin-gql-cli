import { singular } from "pluralize";
import {
  Arg,
  ClassType,
  Ctx,
  Info,
  InputType,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";
import { IGqlContext } from "../../context";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";
import { BaseFilterFields } from "../models/base-filter-fields";
import { BaseSortFields } from "../models/base-sort-fields";
import { EntityToGraphResolver, IListQueryResult } from "./entity-resolver";
import {
  AbstractPaginatorCriteria,
  createPaginationCriteria, Paginated
} from "./paginated-response";
import { IQueryCriteria } from "./query-resolver";

export abstract class AbstractListResolver<
  T,
  BaseFilterFields,
  BaseSortFields
  > extends AbstractSecureResolver {
  list(
    criteriaQuery: AbstractPaginatorCriteria<BaseFilterFields, BaseSortFields>,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<IListQueryResult<T>> {
    throw "Not implemented";
  }
}

export function ListResolver<T extends ClassType>(
  baseModelType: typeof BaseModel,
  filterClass: typeof BaseFilterFields,
  sortClass: typeof BaseSortFields
): typeof AbstractListResolver {
  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );
  //console.log(filterClass, sortClass, baseModelType);
  @InputType(`${baseModelSingularName}Criteria`)
  class CriteriaQuery extends createPaginationCriteria(filterClass, sortClass)<
  BaseFilterFields,
  BaseSortFields
  > { }

  @ObjectType(`${baseModelSingularName}Result`)
  class PaginatedResult extends Paginated(baseModelType)<T> { }

  @Resolver({ isAbstract: true })
  abstract class ListResolver<
    T,
    BaseFilterFields,
    BaseSortFields
    > extends AbstractListResolver<T, BaseFilterFields, BaseSortFields> {
    @Query((returns) => PaginatedResult, {
      name: `${baseModelSingularName}List`,
    })
    list(
      @Arg("criteria", (type) => CriteriaQuery, { nullable: true })
      criteriaQuery: CriteriaQuery,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ) {
      this.checkSecurity(context);
      let result = EntityToGraphResolver.list<T>(
        baseModelType,
        info,
        criteriaQuery as IQueryCriteria
      );
      return result;
    }
  }

  return ListResolver;
}
