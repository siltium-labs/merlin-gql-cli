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
  //console.log(JSON.stringify(merlinGqlMetadataStorage));
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

export const propertyIsFilterIgnored = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsIgnored = !!merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.fields.find((f) => f.name === propertyName && f.ignoreFilter === true);
  return propertyIsIgnored;
};

export const propertyIsSortIgnored = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsIgnored = !!merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.fields.find((f) => f.name === propertyName && f.ignoreSort === true);
  return propertyIsIgnored;
};

export type FieldDefinitionMetadata = {
  name: string;
  ignoreFilter: boolean;
  ignoreSort: boolean;
};

export type CrudOperations =
  | "ALL"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LIST"
  | "FIND";

export type ObjectTypesMetadataStorage = {
  [key: string]: {
    operations: CrudOperations[];
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
export const addOperationMetadata = (
  entityName: string,
  operation: CrudOperations
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    existentMetadataForPrototype.operations = [
      ...existentMetadataForPrototype.operations,
      operation,
    ];
  } else {
    merlinGqlMetadataStorage.objectTypes = {
      ...merlinGqlMetadataStorage.objectTypes,
      ...{
        [entityName]: {
          fields: [],
          extends: null,
          operations: [operation],
        },
      },
    };
  }
};
export const addFieldMetadata = (entityName: string, fieldName: string) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: false,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    existentMetadataForPrototype.fields = [
      ...existentMetadataForPrototype.fields,
      metadataValue,
    ];
  } else {
    merlinGqlMetadataStorage.objectTypes = {
      ...merlinGqlMetadataStorage.objectTypes,
      ...{
        [entityName]: {
          fields: [metadataValue],
          extends: null,
          operations: [],
        },
      },
    };
  }
};

export const addNoSortMetadata = (entityName: string, fieldName: string) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: true,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    existentMetadataForPrototype.fields = [
      ...existentMetadataForPrototype.fields.filter(
        (f) => f.name !== fieldName
      ),
      metadataValue,
    ];
  } else {
    merlinGqlMetadataStorage.objectTypes = {
      ...merlinGqlMetadataStorage.objectTypes,
      ...{
        [entityName]: {
          fields: [metadataValue],
          extends: null,
          operations: [],
        },
      },
    };
  }
};
export const addNoFilterMetadata = (entityName: string, fieldName: string) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue = {
    name: fieldName,
    ignoreFilter: true,
    ignoreSort: false,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    existentMetadataForPrototype.fields = [
      ...existentMetadataForPrototype.fields.filter(
        (f) => f.name !== fieldName
      ),
      metadataValue,
    ];
  } else {
    merlinGqlMetadataStorage.objectTypes = {
      ...merlinGqlMetadataStorage.objectTypes,
      ...{
        [entityName]: {
          fields: [metadataValue],
          extends: null,
          operations: [],
        },
      },
    };
  }
};
