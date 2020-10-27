import { singular } from "pluralize";
import { Arg, ClassType, Ctx, ID, Info, Query, Resolver } from "type-graphql";
import { IGqlContext } from "../../context";
import { BaseModel } from "../../database/base.model";
import { GraphQLInfo } from "../../gql/utils";
import { AbstractSecureResolver } from "../models/abstract-secure-resolver";
import { getTypeormEntityFromSubclass } from "../utils/typeorm";
import { EntityToGraphResolver } from "./entity-resolver";

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
  baseModelSubType: typeof BaseModel
): typeof AbstractFindResolver {
  const baseModelType = getTypeormEntityFromSubclass(baseModelSubType);
  const baseModelSingularName = singular(
    baseModelType.name[0].toLowerCase() + baseModelType.name.slice(1)
  );

  @Resolver({ isAbstract: true })
  abstract class FindResolver<T> extends AbstractFindResolver<T> {
    @Query((returns) => baseModelSubType, {
      name: `${baseModelSingularName}ById`,
      nullable: true,
    })
    async getById(
      @Arg("id", (type) => ID) id: number,
      @Info() info: GraphQLInfo,
      @Ctx() context: IGqlContext
    ): Promise<T | null> {
      this.checkSecurity(context);
      return EntityToGraphResolver.find<T>(id, baseModelType, info);
    }
  }
  return FindResolver;
}
