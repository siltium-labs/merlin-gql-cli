import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseInputFields } from "../models/base-input-fields";

export const Inputs = (
  createInputType?: typeof BaseInputFields,
  updateInputType?: typeof BaseInputFields
) => {
  return function (target: Function) {
    if (createInputType) {
      Reflect.defineMetadata(
        ModelDecoratorMetadataKeys.Create,
        createInputType,
        target
      );
    }
    if (updateInputType) {
      Reflect.defineMetadata(
        ModelDecoratorMetadataKeys.Update,
        updateInputType,
        target
      );
    }
  };
};
