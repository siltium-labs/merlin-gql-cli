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
    ] &&
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

export const propertyIsCreateInputIgnored = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsIgnored = !!merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.fields.find(
    (f) => f.name === propertyName && f.ignoreCreateInput === true
  );
  return propertyIsIgnored;
};

export const propertyIsUpdateInputIgnored = (
  propertyName: string,
  targetClassName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsIgnored = !!merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.fields.find(
    (f) => f.name === propertyName && f.ignoreUpdateInput === true
  );
  return propertyIsIgnored;
};

export const resolverIncludesOperation = (
  targetClassName: string,
  operation: CrudOperations
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const propertyIsIgnored = !!merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.operations.find((o) => o.type === "ALL" || o.type === operation);
  return propertyIsIgnored;
};

export const isOperationSecure = (
  targetClassName: string,
  operation: CrudOperations
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const operationMetadata = merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.operations.find((o) => o.type === "ALL" || o.type === operation);
  return !!operationMetadata?.secure;
};

export const securityRolesAllowedForOperation = (
  targetClassName: string,
  operation: CrudOperations
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const operationMetadata = merlinGqlMetadataStorage.objectTypes[
    targetClassName
  ]?.operations.find(
    (o) => o.type === "ALL" || o.type === operation
  ) as OperationMetadataDefinition;
  return operationMetadata?.roles ?? [];
};

export type FieldDefinitionMetadata = {
  name: string;
  ignoreFilter: boolean;
  ignoreSort: boolean;
  ignoreCreateInput: boolean;
  ignoreUpdateInput: boolean;
};

export type CrudOperations = "CREATE" | "UPDATE" | "DELETE" | "LIST" | "FIND";

export type CrudOperationsAndAll = "ALL" | CrudOperations;

export type OperationMetadataDefinition = {
  type: CrudOperationsAndAll;
  secure: boolean;
  roles?: string[];
};

export type ObjectTypesMetadataStorage = {
  [key: string]: {
    operations: OperationMetadataDefinition[];
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
export const resetMetadataStorage = () => {
  (global as any).MerlinMetadataStorage = MERLIN_METADATA_STORAGE;
};
export const addOperationMetadata = (
  entityName: string,
  operation: CrudOperationsAndAll | OperationMetadataDefinition
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    existentMetadataForPrototype.operations = [
      ...existentMetadataForPrototype.operations,
      typeof operation === "string"
        ? { type: operation, secure: false }
        : operation,
    ];
  } else {
    merlinGqlMetadataStorage.objectTypes = {
      ...merlinGqlMetadataStorage.objectTypes,
      ...{
        [entityName]: {
          fields: [],
          extends: null,
          operations: [
            typeof operation === "string"
              ? { type: operation, secure: false }
              : operation,
          ],
        },
      },
    };
  }
};
export const addFieldMetadata = (entityName: string, fieldName: string) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue: FieldDefinitionMetadata = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: false,
    ignoreCreateInput: false,
    ignoreUpdateInput: false,
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
  const metadataValue: FieldDefinitionMetadata = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: true,
    ignoreCreateInput: false,
    ignoreUpdateInput: false,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    const existentFieldMetadata = existentMetadataForPrototype.fields.find(
      (f) => f.name === metadataValue.name
    );
    if (existentFieldMetadata) {
      existentFieldMetadata.ignoreSort = true;
    } else {
      existentMetadataForPrototype.fields = [
        ...existentMetadataForPrototype.fields,
        metadataValue,
      ];
    }
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
  const metadataValue: FieldDefinitionMetadata = {
    name: fieldName,
    ignoreFilter: true,
    ignoreSort: false,
    ignoreCreateInput: false,
    ignoreUpdateInput: false,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    const existentFieldMetadata = existentMetadataForPrototype.fields.find(
      (f) => f.name === metadataValue.name
    );
    if (existentFieldMetadata) {
      existentFieldMetadata.ignoreFilter = true;
    } else {
      existentMetadataForPrototype.fields = [
        ...existentMetadataForPrototype.fields,
        metadataValue,
      ];
    }
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

export const addNoCreateInputMetadata = (
  entityName: string,
  fieldName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue: FieldDefinitionMetadata = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: false,
    ignoreCreateInput: true,
    ignoreUpdateInput: false,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    const existentFieldMetadata = existentMetadataForPrototype.fields.find(
      (f) => f.name === metadataValue.name
    );
    if (existentFieldMetadata) {
      existentFieldMetadata.ignoreCreateInput = true;
    } else {
      existentMetadataForPrototype.fields = [
        ...existentMetadataForPrototype.fields,
        metadataValue,
      ];
    }
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

export const addNoUpdateInputMetadata = (
  entityName: string,
  fieldName: string
) => {
  const merlinGqlMetadataStorage = getMerlinMetadataStorage();
  const metadataValue: FieldDefinitionMetadata = {
    name: fieldName,
    ignoreFilter: false,
    ignoreSort: false,
    ignoreCreateInput: false,
    ignoreUpdateInput: true,
  };
  const existentMetadataForPrototype =
    merlinGqlMetadataStorage.objectTypes[entityName];
  if (existentMetadataForPrototype) {
    const existentFieldMetadata = existentMetadataForPrototype.fields.find(
      (f) => f.name === metadataValue.name
    );
    if (existentFieldMetadata) {
      existentFieldMetadata.ignoreUpdateInput = true;
    } else {
      existentMetadataForPrototype.fields = [
        ...existentMetadataForPrototype.fields,
        metadataValue,
      ];
    }
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
