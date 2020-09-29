import { getTypeormEntityFromSubclass } from "./../core/type-graphql/utils/typeorm";
import { getMetadataStorage } from "type-graphql";
import { BaseModel } from "./../core/database/base.model";
export const propertyIsDecoratedWithField = (
  prop: string,
  targetClassName: string
) => {
  const metadataStorage = getMetadataStorage();
  const targetClassSubclassMeta = metadataStorage.objectTypes.find(
    (o) =>
      getTypeormEntityFromSubclass(o.target as typeof BaseModel).name ===
      targetClassName
  );
  const targetClassSubclassBase = Object.getPrototypeOf(
    Object.getPrototypeOf(targetClassSubclassMeta?.target)
  );
  const targetClassSubclassBaseMeta = metadataStorage.objectTypes.find(
    (o) => o.target === targetClassSubclassBase
  );

  if (!targetClassSubclassMeta || !targetClassSubclassBaseMeta) {
    return false;
  } else {
    const metaFields = targetClassSubclassMeta.fields ?? [];
    const baseMetaFields = targetClassSubclassBaseMeta.fields ?? [];
    const fields = [...metaFields, ...baseMetaFields];
    return !!(fields.find((f) => f.name === prop) || false);
  }
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
