import { mustBeAuthenticated } from "./../../security/security.decorators";
import { ResolverDecoratorMetadataKeys } from "./../resolver-decorators/resolver-decorator.keys";
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
import { BaseFilterFields } from "../models/base-filter-fields";
import { BaseSortFields } from "../models/base-sort-fields";
import { ModelDecoratorMetadataKeys } from "../model-decorators/model-decorator.keys";
import { EntityToGraphResolver, IListQueryResult } from "./entity-resolver";
import Paginated, {
  AbstractPaginatorCriteria,
  createPaginationCriteria,
} from "./paginated-response";
import { IQueryCriteria } from "./query-resolver";
import { AbstractSecureResolver } from '../models/abstract-secure-resolver';

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
  baseModelType: typeof BaseModel
): typeof AbstractListResolver {
  const filterClass: typeof BaseFilterFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Filter,
    baseModelType
  );
  const sortClass: typeof BaseSortFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Sort,
    baseModelType
  );
  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );

  @InputType(`${baseModelSingularName}Criteria`)
  class CriteriaQuery extends createPaginationCriteria(filterClass, sortClass)<
    BaseFilterFields,
    BaseSortFields
  > {}

  @ObjectType(`${baseModelSingularName}Result`)
  class PaginatedResult extends Paginated(baseModelType)<T> {}

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
      const hasSecureDecorator: boolean = (this as any).constructor.hasSecureDecorator();
      if (hasSecureDecorator) {
        mustBeAuthenticated(context);
      }

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
