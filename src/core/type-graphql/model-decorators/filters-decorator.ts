import { ModelDecoratorMetadataKeys } from "./model-decorator.keys";
import { BaseFilterFields } from "../models/base-filter-fields";

export const Filter = (filtersType: typeof BaseFilterFields) => {
  return function (target: Function) {
    const superClass = Object.getPrototypeOf(target);
    Reflect.defineMetadata(
      ModelDecoratorMetadataKeys.Filter,
      filtersType,
      superClass
    );
  };
};
