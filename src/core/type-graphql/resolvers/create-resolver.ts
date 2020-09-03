import { singular } from "pluralize";
import {
  Arg,
  ClassType,
  Info,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
  Ctx,
} from "type-graphql";
import { getRepository } from "typeorm";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { BaseInputFields } from "../models/base-input-fields";
import { ModelDecoratorMetadataKeys } from "../model-decorators/model-decorator.keys";
import { EntityToGraphResolver } from "./entity-resolver";
import { IGqlContext } from "../../context";
import { mustBeAuthenticated } from "../../security/security.decorators";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";

export abstract class AbstractCreateResolver<T> extends AbstractSecureResolver {
  async create(
    entity: Partial<T>,
    pubSub: PubSubEngine,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<T> {
    throw "Not implemented";
  }

  async notifyCreate(
    payload: T,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<T> {
    throw "Not implemented";
  }
}

export function CreateResolver<T extends ClassType>(
  baseModelType: typeof BaseModel
): typeof AbstractCreateResolver {
  const inputClass: typeof BaseInputFields = Reflect.getMetadata(
    ModelDecoratorMetadataKeys.Input,
    baseModelType
  );

  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );

  @Resolver({ isAbstract: true })
  abstract class CreateResolver<T> extends AbstractCreateResolver<T> {
    @Mutation((returns) => baseModelType, {
      name: `${baseModelSingularName}Create`,
    })
    async create(
      @Arg("data", (type) => inputClass) entity: Partial<T>,
      @PubSub() pubSub: PubSubEngine,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T> {
      const hasSecureDecorator: boolean = (this as any).constructor.hasSecureDecorator();
      if (hasSecureDecorator) {
        mustBeAuthenticated(context);
      }
      const object = Object.assign(new baseModelType(), entity);
      const inserted = await getRepository(baseModelType).save(object);
      //const inserted = await getManager().save(entity);
      await pubSub.publish(`${baseModelSingularName}Create`, inserted);
      const idProperty = baseModelType.getIdPropertyName();
      const idValue = (inserted as { [key: string]: any })[idProperty];
      return EntityToGraphResolver.find<T>(
        idValue,
        baseModelType,
        info
      ) as Promise<T>;
    }

    @Subscription((returns) => baseModelType, {
      topics: `${baseModelSingularName}Create`,
      name: `${baseModelSingularName}Create`,
    })
    async notifyCreate(
      @Root() payload: T,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T> {
      const hasSecureDecorator: boolean = (this as any).constructor.hasSecureDecorator();
      if (hasSecureDecorator) {
        mustBeAuthenticated(context);
      }
      const idProperty = baseModelType.getIdPropertyName();
      const idValue = (payload as { [key: string]: any })[idProperty];
      return EntityToGraphResolver.find(
        idValue,
        baseModelType,
        info
      ) as Promise<T>;
    }
  }

  return CreateResolver;
}
