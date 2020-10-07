import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseInputFields } from "../models/base-input-fields";

export const Sort = (sortsType: typeof BaseInputFields) => {
  return function (target: Function) {
    Reflect.defineMetadata(
      ModelDecoratorMetadataKeys.Sort,
      sortsType,
      target 
    );
  };
};
