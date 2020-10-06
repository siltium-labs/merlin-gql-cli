import {
  ObjectType as TypeGraphQLObjectType,
  ObjectTypeOptions,
} from "type-graphql";
import {
  CrudOperationsAndAll,
  getMerlinMetadataStorage,
} from "./../../../utils/metadata-storage";

export function ObjectType(
  filePath: string,
  operations: CrudOperationsAndAll[]
): ClassDecorator;
export function ObjectType(
  filePath: string,
  operations: CrudOperationsAndAll[],
  options: ObjectTypeOptions
): ClassDecorator;
export function ObjectType(
  filePath: string,
  operations: CrudOperationsAndAll[],
  name: string,
  options?: ObjectTypeOptions
): ClassDecorator;
export function ObjectType(
  filePath: string,
  operations: CrudOperationsAndAll[],
  nameOrOptions?: string | ObjectTypeOptions,
  maybeOptions?: ObjectTypeOptions
): ClassDecorator {
  return (target) => {
    console.log("Creating OT factory");
    const merlinGqlMetadataStorage = getMerlinMetadataStorage();
    const superClass = Object.getPrototypeOf(target).name;
    const baseSuperClass = Object.getPrototypeOf(Object.getPrototypeOf(target))
      .name;
    const metadataEntry = merlinGqlMetadataStorage.objectTypes[superClass];
    if (metadataEntry) {
      metadataEntry.extends = baseSuperClass;
      metadataEntry.filePath = filePath;
      metadataEntry.operations = operations;
    } else {
      merlinGqlMetadataStorage.objectTypes = {
        ...merlinGqlMetadataStorage.objectTypes,
        ...{
          [superClass]: {
            filePath: filePath,
            fields: [],
            extends: baseSuperClass,
            operations: operations,
          },
        },
      };
    }
    return TypeGraphQLObjectType(nameOrOptions as any, maybeOptions)(target);
  };
}
