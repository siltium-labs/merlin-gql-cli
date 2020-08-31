import { BaseSortFields } from "./base-sort-fields.model";
import { BaseInput } from "./base-input.model";
import {
  ClassType,
  Resolver,
  Query,
  Arg,
  Info,
  ID,
  Mutation,
  ObjectType,
  InputType,
  Ctx,
} from "type-graphql";
import { GraphQLInfo } from "../gql/utils";
import { EntityToGraphResolver, IListQueryResult } from "../entity-resolver";
import { BaseModel } from "../models/base.model";
import { getManager, EntityManager, getRepository } from "typeorm";

import { IQueryCriteria } from "../query-resolver";
import Paginated, {
  createPaginationCriteria,
  AbstractPaginatorCriteria,
} from "./paginated-response";
import { BaseFilterFields } from "./base-filter-fields.model";
import { IGqlContext } from '../context';


export abstract class AbstractBaseResolver<
  T,
  BaseFilterFields,
  BaseSortFields
> {
  /*list(
    criteriaQuery: AbstractPaginatorCriteria<BaseFilterFields, BaseSortFields>,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<IListQueryResult<T>> {
    throw "Not implemented";
  }*/

  async getById(id: number, info: GraphQLInfo): Promise<T | null> {
    throw "Not implemented";
  }

  async create(entity: Partial<T>): Promise<BaseModel> {
    throw "Not implemented";
  }

  async update(id: number, entity: Partial<T>): Promise<BaseModel> {
    throw "Not implemented";
  }

  async delete(id: number): Promise<boolean> {
    throw "Not implemented";
  }
}

export function createBaseResolver<T extends ClassType>(
  suffix: string,
  modelType: typeof BaseModel,
  inputType: typeof BaseInput,
  filter: typeof BaseFilterFields,
  sorter: typeof BaseSortFields
): typeof AbstractBaseResolver {
  @InputType(`${suffix}Criteria`)
  class CriteriaQuery extends createPaginationCriteria(filter, sorter)<
    BaseFilterFields,
    BaseSortFields
  > {}

  //type CriteriaQueryType = InstanceType<typeof CriteriaQuery>;

  @ObjectType(`${suffix}Result`)
  class PaginatedResult extends Paginated(modelType)<T> {
    list(
      @Arg("criteria", (type) => CriteriaQuery, { nullable: true })
      criteriaQuery: CriteriaQuery,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ) {
      let result = EntityToGraphResolver.list<T>(
        modelType,
        info,
        criteriaQuery as IQueryCriteria
      );
      return result;
    }
  }

  @Resolver({ isAbstract: true })
  abstract class BaseResolver<
    T,
    BaseFilterFields,
    BaseSortFields
  > extends AbstractBaseResolver<T, BaseFilterFields, BaseSortFields> {
    @Query((returns) => PaginatedResult, {
      name: `list${suffix}`,
      nullable: true,
    })
    list(
      @Arg("criteria", (type) => CriteriaQuery, { nullable: true })
      criteriaQuery: CriteriaQuery,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ) {
      let result = EntityToGraphResolver.list<T>(
        modelType,
        info,
        criteriaQuery as IQueryCriteria
      );
      return result;
    }

    @Query((returns) => modelType, {
      name: `${suffix}ById`,
      nullable: true,
    })
    async getById(
      @Arg("id", (type) => ID) id: number,
      @Info() info: GraphQLInfo
    ): Promise<T | null> {
      return EntityToGraphResolver.find<T>(id, modelType, info);
    }

    @Mutation((returns) => modelType, {
      name: `create${suffix}`,
    })
    async create(
      @Arg("data", (type) => inputType) entity: Partial<T>
    ): Promise<BaseModel> {
      const object = Object.assign(new modelType(), entity);
      const inserted = await getRepository(modelType).save(object);
      //const inserted = await getManager().save(entity);
      return inserted;
    }

    @Mutation((returns) => modelType, {
      name: `update${suffix}`,
    })
    async update(
      @Arg("id", (type) => ID) id: number,
      @Arg("data", (type) => inputType) entity: Partial<T>
    ): Promise<BaseModel> {
      await getManager()
        .createQueryBuilder()
        .update(modelType)
        .set(entity)
        .where("id = :id", { id })
        .execute();
      return <BaseModel>(
        await getManager()
          .getRepository(modelType)
          .createQueryBuilder("e")
          .where("e.id = :id", { id })
          .getOne()
      );
    }

    @Mutation((returns) => Boolean, {
      name: `delete${suffix}`,
    })
    async delete(@Arg("id", (type) => ID) id: number): Promise<boolean> {
      await getManager()
        .createQueryBuilder()
        .update(modelType)
        .set({ deleted: true })
        .where("id = :id", { id })
        .execute();

      return true;
    }
  }

  return BaseResolver;
}
