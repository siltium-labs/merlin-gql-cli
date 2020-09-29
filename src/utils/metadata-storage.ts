import { getMetadataStorage } from "type-graphql";
import { getTypeormEntityFromSubclass } from "../core/type-graphql/utils/typeorm";
import { BaseModel } from "./../core/database/base.model";
export const propertyIsDecoratedWithField = (
  prop: string,
  targetClass: typeof BaseModel
) => {
  const metadataStorage = getMetadataStorage();
  return metadataStorage.fields.find(
    (f) =>
      f.name === prop &&
      (getTypeormEntityFromSubclass(f.target as typeof BaseModel) ===
        targetClass ||
        f.target === targetClass)
  );
};

export type ObjectTypesMetadataStorage = Array<any>;

const MERLIN_METADATA_STORAGE: {
  objectTypes: ObjectTypesMetadataStorage;
} = {
  objectTypes: [],
};

export const getMerlinMetadataStorage = () => {
  return MERLIN_METADATA_STORAGE;
};
