import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseInputFields } from "../models/base-input-fields";
import { BaseModel } from "../../database/base.model";
import { InputType as TypeGraphQLInputType } from "type-graphql";

export const CreateInput = (of: typeof BaseModel) => {
  return function (target: typeof BaseInputFields) {
    Reflect.defineMetadata(ModelDecoratorMetadataKeys.Create, target, of);
    TypeGraphQLInputType()(target);
  };
};

export const UpdateInput = (of: typeof BaseModel) => {
  return function (target: typeof BaseInputFields) {
    Reflect.defineMetadata(ModelDecoratorMetadataKeys.Update, target, of);
    TypeGraphQLInputType()(target);
  };
};
