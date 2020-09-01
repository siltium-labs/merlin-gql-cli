import { BaseInputFields } from "./../models/base-input.model";
import { ModelDecoratorMetadataKeys } from "./../decorators/keys";
import { BaseSortFields } from "../models/base-sort-fields.model";
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
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
} from "type-graphql";
import { GraphQLInfo } from "../../gql/utils";
import { EntityToGraphResolver, IListQueryResult } from "./entity-resolver";
import { BaseModel } from "../../database/base.model";
import { getManager, EntityManager, getRepository } from "typeorm";

import { IQueryCriteria } from "./query-resolver";
import Paginated, {
  createPaginationCriteria,
  AbstractPaginatorCriteria,
} from "./paginated-response";
import { BaseFilterFields } from "../models/base-filter-fields.model";
import { IGqlContext } from "../../context";

import { singular, plural } from "pluralize";

export abstract class AbstractBaseResolver<
  T,
  BaseFilterFields,
  BaseSortFields
> {
  list(
    criteriaQuery: AbstractPaginatorCriteria<BaseFilterFields, BaseSortFields>,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<IListQueryResult<T>> {
    throw "Not implemented";
  }

  async getById(id: number, info: GraphQLInfo): Promise<T | null> {
    throw "Not implemented";
  }

  async create(entity: Partial<T>, pubSub: PubSubEngine): Promise<BaseModel> {
    throw "Not implemented";
  }

  async update(
    id: number,
    entity: Partial<T>,
    pubSub: PubSubEngine
  ): Promise<BaseModel> {
    throw "Not implemented";
  }

  async delete(id: number, pubSub: PubSubEngine): Promise<boolean> {
    throw "Not implemented";
  }

  async notifyCreate(payload: T): Promise<T> {
    throw "Not implemented";
  }
}

export function createBaseResolver<T extends ClassType>(
  suffix: string,
  baseModelType: typeof BaseModel
): typeof AbstractBaseResolver {
  const filterClass: typeof BaseFilterFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Filter,
    baseModelType
  );
  const inputClass: typeof BaseInputFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Input,
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
  class PaginatedResult extends Paginated(baseModelType)<T> {
    list(
      @Arg("criteria", (type) => CriteriaQuery, { nullable: true })
      criteriaQuery: CriteriaQuery,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ) {
      let result = EntityToGraphResolver.list<T>(
        baseModelType,
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
      name: `${baseModelSingularName}List`,
      nullable: true,
    })
    list(
      @Arg("criteria", (type) => CriteriaQuery, { nullable: true })
      criteriaQuery: CriteriaQuery,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ) {
      let result = EntityToGraphResolver.list<T>(
        baseModelType,
        info,
        criteriaQuery as IQueryCriteria
      );
      return result;
    }

    @Query((returns) => baseModelType, {
      name: `${baseModelSingularName}ById`,
      nullable: true,
    })
    async getById(
      @Arg("id", (type) => ID) id: number,
      @Info() info: GraphQLInfo
    ): Promise<T | null> {
      return EntityToGraphResolver.find<T>(id, baseModelType, info);
    }

    @Mutation((returns) => baseModelType, {
      name: `${baseModelSingularName}Create`,
    })
    async create(
      @Arg("data", (type) => inputClass) entity: Partial<T>,
      @PubSub() pubSub: PubSubEngine
    ): Promise<BaseModel> {
      const object = Object.assign(new baseModelType(), entity);
      const inserted = await getRepository(baseModelType).save(object);
      //const inserted = await getManager().save(entity);
      await pubSub.publish(`${baseModelSingularName}Create`, inserted);
      return inserted;
    }

    @Mutation((returns) => baseModelType, {
      name: `${baseModelSingularName}Update`,
    })
    async update(
      @Arg("id", (type) => ID) id: number,
      @Arg("data", (type) => inputClass) entity: Partial<T>,
      @PubSub() pubSub: PubSubEngine
    ): Promise<BaseModel> {
      const idDatabaseName = baseModelType.getIdDatabaseName();
      await getManager()
        .createQueryBuilder()
        .update(baseModelType)
        .set(entity)
        .where(`${idDatabaseName} = :id`, { id })
        .execute();
      const updated = <BaseModel>(
        await getManager()
          .getRepository(baseModelType)
          .createQueryBuilder("e")
          .where(`e.${idDatabaseName} = :id`, { id })
          .getOne()
      );
      await pubSub.publish(`${baseModelSingularName}Update`, updated);
      return updated;
    }

    @Mutation((returns) => Boolean, {
      name: `${baseModelSingularName}Delete`,
    })
    async delete(
      @Arg("id", (type) => ID) id: number,
      @PubSub() pubSub: PubSubEngine
    ): Promise<boolean> {
      const idDatabaseName = baseModelType.getIdDatabaseName();
      //lets save the object in memory to notify the pubsub once it gets deleted
      const toDelete = <BaseModel>(
        await getManager()
          .getRepository(baseModelType)
          .createQueryBuilder("e")
          .where(`e.${idDatabaseName} = :id`, { id })
          .getOne()
      );
      //Try soft delete, if not possible then bye bye record
      try {
        await getManager()
          .createQueryBuilder()
          .softDelete()
          .from(baseModelType)
          .where(`${idDatabaseName} = :id`, { id })
          .execute();
      } catch (ex) {
        if (ex.name === "MissingDeleteDateColumnError") {
          // Database Delete
          await getManager()
            .createQueryBuilder()
            .delete()
            .from(baseModelType)
            .where(`${idDatabaseName} = :id`, { id })
            .execute();
        }
      }

      await pubSub.publish(`${baseModelSingularName}Delete`, toDelete);

      return true;
    }

    @Subscription((returns) => baseModelType, {
      topics: `${baseModelSingularName}Create`,
      name: `${baseModelSingularName}Create`,
    })
    async notifyCreate(@Root() payload: T): Promise<T> {
      const idProp = baseModelType.getIdPropertyName();
      const idValue = (payload as { [key: string]: any })[idProp];
      return <T>(
        await getManager()
          .getRepository(baseModelType)
          .createQueryBuilder("e")
          .where(`e.${idProp} = :id`, { id: idValue })
          .getOne()
      );
    }

    @Subscription((returns) => baseModelType, {
      topics: `${baseModelSingularName}Update`,
      name: `${baseModelSingularName}Update`,
    })
    async notifyUpdate(@Root() payload: T): Promise<T> {
      const idProp = baseModelType.getIdPropertyName();
      const idValue = (payload as { [key: string]: any })[idProp];
      return <T>(
        await getManager()
          .getRepository(baseModelType)
          .createQueryBuilder("e")
          .where(`e.${idProp} = :id`, { id: idValue })
          .getOne()
      );
    }

    @Subscription((returns) => baseModelType, {
      topics: `${baseModelSingularName}Delete`,
      name: `${baseModelSingularName}Delete`,
    })
    async notifyDelete(@Root() payload: T): Promise<T> {
      //const idProp = baseModelType.getIdPropertyName();
      //const idValue = (payload as { [key: string]: any })[idProp];
      return payload;
    }
  }

  return BaseResolver;
}
