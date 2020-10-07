import { singular } from "pluralize";
import {
  Arg,
  ClassType,
  Ctx,
  Info,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { IGqlContext } from "../../context";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { ModelDecoratorMetadataKeys } from "../model-decorators/model-decorator.keys";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";
import { BaseFilterFields } from "../models/base-filter-fields";
import { BaseSortFields } from "../models/base-sort-fields";
import { getTypeormEntityFromSubclass } from "../utils/typeorm";
import { EntityToGraphResolver, IListQueryResult } from "./entity-resolver";
import Paginated, {
  AbstractPaginatorCriteria,
  createPaginationCriteria,
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
  baseModelSubType: typeof BaseModel
): typeof AbstractListResolver {
  const baseModelType = getTypeormEntityFromSubclass(baseModelSubType);
  const filterClass: typeof BaseFilterFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Filter,
    baseModelSubType
  );
  const sortClass: typeof BaseSortFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Sort,
    baseModelSubType
  );
  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );
  console.log(filterClass, sortClass, baseModelSubType);
  @InputType(`${baseModelSingularName}Criteria`)
  class CriteriaQuery extends createPaginationCriteria(filterClass, sortClass)<
    BaseFilterFields,
    BaseSortFields
  > {}

  @ObjectType(`${baseModelSingularName}Result`)
  class PaginatedResult extends Paginated(baseModelSubType)<T> {}

  @Resolver({ isAbstract: true })
  abstract class ListResolver<
    T,
    BaseFilterFields,
    BaseSortFields
  > extends AbstractListResolver<T, BaseFilterFields, BaseSortFields> {
    @Query((returns) => PaginatedResult, {
      name: `${baseModelSingularName}List`,
      nullable: true,
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
