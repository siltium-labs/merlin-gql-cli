import { singular } from "pluralize";
import {
  Arg,
  ClassType,
  ID,
  Info,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
  Ctx,
} from "type-graphql";
import { getManager } from "typeorm";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { BaseInputFields } from "../models/base-input-fields";
import { ModelDecoratorMetadataKeys } from "../model-decorators/model-decorator.keys";
import { EntityToGraphResolver } from "./entity-resolver";
import { IGqlContext } from "../../context";
import {
  mustBeAuthenticated,
  mustHaveRole,
} from "../../security/security.decorators";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";

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
  baseModelType: typeof BaseModel
): typeof AbstractUpdateResolver {
  const inputClass: typeof BaseInputFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Input,
    baseModelType
  );

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
      @Arg("data", (type) => inputClass) entity: Partial<T>,
      @PubSub() pubSub: PubSubEngine,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T> {
      this.checkSecurity(context);

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
      const idProperty = baseModelType.getIdPropertyName();
      const idValue = (updated as { [key: string]: any })[idProperty];
      return EntityToGraphResolver.find<T>(
        idValue,
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
