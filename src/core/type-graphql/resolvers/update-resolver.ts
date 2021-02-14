import { singular } from "pluralize";
import {
  Arg,
  ClassType,
  Ctx,
  ID,
  Info,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { getManager } from "typeorm";
import { IGqlContext } from "../../context";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { ModelDecoratorMetadataKeys } from "../model-decorators/model-decorator.keys";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";
import { BaseInputFields } from "../models/base-input-fields";
import { getTypeormEntityFromSubclass } from "../utils/typeorm";
import { EntityToGraphResolver } from "./entity-resolver";

export abstract class AbstractUpdateResolver<T> extends AbstractSecureResolver {
  async update(
    id: number,
    entity: Partial<T>,
    pubSub: PubSubEngine,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<T> {
    throw "Not implemented";
  }

  async notifyUpdate(
    payload: T,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<T> {
    throw "Not implemented";
  }
}

export function UpdateResolver<T extends ClassType>(
  baseModelType: typeof BaseModel,
  inputUpdateClass: typeof BaseInputFields
): typeof AbstractUpdateResolver {

  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );

  @Resolver({ isAbstract: true })
  abstract class UpdateResolver<T> extends AbstractUpdateResolver<T> {
    @Mutation((returns) => baseModelType, {
      name: `${baseModelSingularName}Update`,
    })
    async update(
      @Arg("id", (type) => ID) id: number,
      @Arg("data", (type) => inputUpdateClass) entity: Partial<T>,
      @PubSub() pubSub: PubSubEngine,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T> {
      this.checkSecurity(context);

      const em = await getManager();
      const idDatabaseName = baseModelType.getIdDatabaseName();
      const dbEntity = <BaseModel>(
        await getManager()
          .getRepository(baseModelType)
          .createQueryBuilder("e")
          .where(`e.${idDatabaseName} = :id`, { id })
          .getOne()
      );
      let entityToUpdate = { ...dbEntity, ...entity };
      entityToUpdate = await em
        .getRepository(baseModelType)
        .save(entityToUpdate);
      await pubSub.publish(`${baseModelSingularName}Update`, entityToUpdate);
      return EntityToGraphResolver.find<T>(
        id,
        baseModelType,
        info
      ) as Promise<T>;
    }

    @Subscription((returns) => baseModelType, {
      topics: `${baseModelSingularName}Update`,
      name: `${baseModelSingularName}Update`,
    })
    async notifyUpdate(
      @Root() payload: T,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T> {
      this.checkSecurity(context);
      const idProperty = baseModelType.getIdPropertyName();
      const idValue = (payload as { [key: string]: any })[idProperty];
      return EntityToGraphResolver.find(
        idValue,
        baseModelType,
        info
      ) as Promise<T>;
    }
  }

  return UpdateResolver;
}
