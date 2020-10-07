import { BaseModel } from "./../../database/base.model";
import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseFilterFields } from "../models/base-filter-fields";
import { InputType as TypeGraphQLInputType } from "type-graphql";

export const Filter = (of: typeof BaseModel) => {
  return function (target: Function) {
    Reflect.defineMetadata(ModelDecoratorMetadataKeys.Filter, target, of);
    TypeGraphQLInputType()(target);
  };
};
