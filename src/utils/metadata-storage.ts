import { getTypeormEntityFromSubclass } from "./../core/type-graphql/utils/typeorm";
import { getMetadataStorage } from "type-graphql";
import { BaseModel } from "./../core/database/base.model";
export const propertyIsDecoratedWithField = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsDirectField = !!(
    merlinGqlMetadataStorage.objectTypes[targetClassName]?.fields.indexOf(
      propertyName
    ) > -1
  );
  //console.log(JSON.stringify(merlinGqlMetadataStorage));
  const propertyIsInheritedField = !!(
    merlinGqlMetadataStorage.objectTypes[targetClassName]?.extends &&
    merlinGqlMetadataStorage.objectTypes[
      merlinGqlMetadataStorage.objectTypes[targetClassName]?.extends as string
    ].fields.indexOf(propertyName) > -1
  );
  return propertyIsDirectField || propertyIsInheritedField;
};

export type ObjectTypesMetadataStorage = {
  [key: string]: {
    fields: string[];
    extends: string | null;
  };
};
const MERLIN_METADATA_STORAGE: {
  objectTypes: ObjectTypesMetadataStorage;
} = {
  objectTypes: {},
};

export const getMerlinMetadataStorage = () => {
  return (
    (global as any).MerlinMetadataStorage ||
    ((global as any).MerlinMetadataStorage = MERLIN_METADATA_STORAGE)
  );
};
