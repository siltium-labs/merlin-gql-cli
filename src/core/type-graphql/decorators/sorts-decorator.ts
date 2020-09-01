import { ModelDecoratorMetadataKeys } from "./keys";
import { BaseInputFields } from "../models/base-input.model";

export const Sorts = (sortsType: typeof BaseInputFields) => {
  return function (target: Function) {
    Reflect.defineMetadata(
      ModelDecoratorMetadataKeys.Sort,
      sortsType,
      target
    );
  };
};
