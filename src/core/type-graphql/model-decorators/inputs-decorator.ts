import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseInputFields } from "../models/base-input-fields";

export const Inputs = (
  createInputType?: typeof BaseInputFields,
  updateInputType?: typeof BaseInputFields
) => {
  return function (target: Function) {
    const superClass = Object.getPrototypeOf(target);
    if (createInputType) {
      Reflect.defineMetadata(
        ModelDecoratorMetadataKeys.Create,
        createInputType,
        superClass
      );
    }
    if (updateInputType) {
      Reflect.defineMetadata(
        ModelDecoratorMetadataKeys.Update,
        updateInputType,
        superClass
      );
    }
  };
};
