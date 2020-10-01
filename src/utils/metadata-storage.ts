import { getTypeormEntityFromSubclass } from "./../core/type-graphql/utils/typeorm";
import { getMetadataStorage } from "type-graphql";
import { BaseModel } from "./../core/database/base.model";
export const propertyIsDecoratedWithField = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsDirectField = !!(
    merlinGqlMetadataStorage.objectTypes[targetClassName]?.fields
      .map((f) => f.name)
      .indexOf(propertyName) > -1
  );
  console.log(JSON.stringify(merlinGqlMetadataStorage));
  const propertyIsInheritedField = !!(
    merlinGqlMetadataStorage.objectTypes[targetClassName]?.extends &&
    merlinGqlMetadataStorage.objectTypes[
      merlinGqlMetadataStorage.objectTypes[targetClassName]?.extends as string
    ].fields
      .map((f) => f.name)
      .indexOf(propertyName) > -1
  );
  return propertyIsDirectField || propertyIsInheritedField;
};

export type FieldDefinitionMetadata = {
  name: string;
  ignoreFilter: boolean;
  ignoreSort: boolean;
};

export type ObjectTypesMetadataStorage = {
  [key: string]: {
    fields: FieldDefinitionMetadata[];
    extends: string | null;
  };
};

export type MerlinMetadataStorage = {
  objectTypes: ObjectTypesMetadataStorage;
};
const MERLIN_METADATA_STORAGE: MerlinMetadataStorage = {
  objectTypes: {},
};

export const getMerlinMetadataStorage = (): MerlinMetadataStorage => {
  return (
    (global as any).MerlinMetadataStorage ||
    ((global as any).MerlinMetadataStorage = MERLIN_METADATA_STORAGE)
  );
};
