import { BaseModel } from './../../database/base.model';
import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseInputFields } from "../models/base-input-fields";
import { InputType as TypeGraphQLInputType } from "type-graphql";

export const Sorts = (of: typeof BaseModel) => {
  return function (target: typeof BaseInputFields) {
    Reflect.defineMetadata(
      ModelDecoratorMetadataKeys.Sort,
      target,
      of 
    );
    TypeGraphQLInputType()(target);
  };
};
