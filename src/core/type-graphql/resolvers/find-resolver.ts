import { singular } from "pluralize";
import { Arg, ClassType, ID, Info, Query, Resolver, Ctx } from "type-graphql";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { EntityToGraphResolver } from "./entity-resolver";
import { mustBeAuthenticated } from "../../security/security.decorators";
import { IGqlContext } from "../../context";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";

export abstract class AbstractFindResolver<T> extends AbstractSecureResolver {
  async getById(
    id: number,
    info: GraphQLInfo,
    context: IGqlContext
  ): Promise<T | null> {
    throw "Not implemented";
  }
}

export function FindResolver<T extends ClassType>(
  baseModelType: typeof BaseModel
): typeof AbstractFindResolver {
  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );

  @Resolver({ isAbstract: true })
  abstract class FindResolver<T> extends AbstractFindResolver<T> {
    @Query((returns) => baseModelType, {
      name: `${baseModelSingularName}ById`,
      nullable: true,
    })
    async getById(
      @Arg("id", (type) => ID) id: number,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T | null> {
      const hasSecureDecorator: boolean = (this as any).constructor.hasSecureDecorator();
      if (hasSecureDecorator) {
        mustBeAuthenticated(context);
      }
      return EntityToGraphResolver.find<T>(id, baseModelType, info);
    }
  }

  return FindResolver;
}
