import { FieldNode, GraphQLResolveInfo } from "graphql";
import { EntityManager, getManager, SelectQueryBuilder } from "typeorm";
import { BaseModel } from "../../database/base.model";
import {
  getQueryData,
  getQueryDataFromFilters,
  getQueryDataFromSorts,
  GraphQLPartialResolveInfo
} from "../../gql/utils";
import { populate } from "./populate";
import {
  criteriaToQbOrderBy,
  criteriaToQbWhere,
  IQueryCriteria,
  IQueryData,
  isPageInfoFieldNode
} from "./query-resolver";

export interface IListQueryResult<T> {
  pageInfo: {
    total: number | Promise<number>;
  };
  result: T[] | Promise<T[]>;
}

export interface IListQueryResult<T> {
  pageInfo: {
    total: number | Promise<number>;
  };
  result: T[] | Promise<T[]>;
}
export interface IEntityResolver {
  /**
   * Reads the GraphQL info and criteria and creates the corresponding query builder
   *  */
  list(
    modelType: typeof BaseModel,
    info: GraphQLResolveInfo | GraphQLPartialResolveInfo,
    criteria: IQueryCriteria | null,
    em?: EntityManager,
    inheritedQb?: SelectQueryBuilder<BaseModel>
  ): Promise<IListQueryResult<BaseModel>>;

  /**
   * Reads the GraphQL info and criteria and creates the corresponding query builder
   * */
  list<TModel>(
    modelType: typeof BaseModel,
    info: GraphQLResolveInfo | GraphQLPartialResolveInfo,
    criteria: IQueryCriteria | null,
    em?: EntityManager,
    inheritedQb?: SelectQueryBuilder<TModel>
  ): Promise<IListQueryResult<TModel>>;
  /**
   * Reads the GraphQL info and creates the corresponding query builder for a single entity retrieval
   *  */

  find(
    id: number,
    modelType: typeof BaseModel,
    info: GraphQLResolveInfo | GraphQLPartialResolveInfo,
    em?: EntityManager,
    includeDeleted?: boolean
  ): Promise<BaseModel | null>;
  /**
   * Reads the GraphQL info and creates the corresponding query builder for a single entity retrieval
   * */

  find<TModel>(
    id: number,
    modelType: typeof BaseModel,
    info: GraphQLResolveInfo | GraphQLPartialResolveInfo,
    em?: EntityManager,
    includeDeleted?: boolean
  ): Promise<TModel | null>;
}

export const EntityToGraphResolver: IEntityResolver = {
  list: async (
    modelType: typeof BaseModel,
    gqlQyeryInfo: GraphQLResolveInfo,
    criteria: IQueryCriteria | null,
    em?: EntityManager,
    inheritedQb?: SelectQueryBuilder<BaseModel>
  ) => {
    try {
      const manager = em ?? getManager();
      const fieldsNode = <FieldNode>(
        gqlQyeryInfo.fieldNodes[0].selectionSet?.selections.find(
          (node) => !isPageInfoFieldNode(<FieldNode>node)
        )
      );
      const fields = getQueryData(fieldsNode, modelType, criteria?.sort);
      const idName = modelType.getIdDatabaseName();
      const modelAlias =
        inheritedQb?.alias ??
        modelType.name[0].toLowerCase() + modelType.name.substring(1);
      let queryBuilder =
        inheritedQb ??
        manager.getRepository(modelType).createQueryBuilder(modelAlias);
      queryBuilder.select([
        `${modelAlias}.${idName}`,
        ...fields.selectedFields.map((f) => `${modelAlias}.${f}`),
      ]);
      const filterParsed = criteria?.filter ?? null;
      const sortParsed = criteria?.sort ?? null;
      const queryDataFromFilters = getQueryDataFromFilters(
        fields,
        filterParsed,
        modelType.getRelations()
      );
      const queryDataFromSorts = sortParsed
        ? getQueryDataFromSorts(fields, sortParsed, modelType.getRelations())
        : { selectedFields: [], relatedEntities: [] };

      const allQueryData: IQueryData = {
        selectedFields: Array.from(
          new Set([
            ...queryDataFromFilters.selectedFields,
            ...queryDataFromSorts.selectedFields,
          ])
        ),
        relatedEntities: Array.from(
          new Set([
            ...queryDataFromFilters.relatedEntities,
            ...queryDataFromSorts.relatedEntities,
          ])
        ),
      };

      allQueryData.relatedEntities?.map((relation) => {
        populate(modelAlias, idName, queryBuilder, relation);
      });
      criteriaToQbWhere(modelAlias, queryBuilder, filterParsed);
      criteriaToQbOrderBy(modelAlias, queryBuilder, sortParsed);

      const total = queryBuilder.getCount();

      if (criteria?.max) {
        queryBuilder.take(criteria.max);
      }

      if (criteria?.skip) {
        if (!criteria?.max) {
          queryBuilder.take(Math.pow(2, 32));
        }
        queryBuilder.skip(criteria.skip);
      }

      if (criteria?.includeDeleted) {
        queryBuilder.withDeleted();
      }

      const result = queryBuilder.getMany();
      const pageInfo = { total };
      return { pageInfo, result };
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  find: async (
    id: number,
    modelType: typeof BaseModel,
    info: GraphQLResolveInfo,
    em?: EntityManager,
    includeDeleted?: boolean
  ) => {
    try {
      const manager = em ?? getManager();
      const fields = getQueryData(<FieldNode>info.fieldNodes[0], modelType);
      const idName = modelType.getIdDatabaseName();
      const modelAlias =
        modelType.name[0].toLowerCase() + modelType.name.substring(1);
      const queryBuilder = manager
        .getRepository(modelType)
        .createQueryBuilder(modelAlias)
        .select([
          `${modelAlias}.${idName}`,
          ...fields.selectedFields.map((f) => `${modelAlias}.${f}`),
        ])
        .where(`${modelAlias}.${idName} = :id`, { id });

      if (includeDeleted) {
        queryBuilder.withDeleted();
      }

      fields.relatedEntities?.map((relation) => {
        populate(modelAlias, idName, queryBuilder, relation);
      });

      const result = await queryBuilder.getOne();
      return result ?? null;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
