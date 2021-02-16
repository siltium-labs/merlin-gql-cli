import {
  ObjectType as TypeGraphQLObjectType,
  ObjectTypeOptions,
} from "type-graphql";
import {
  CrudOperationsAndAll,
  getMerlinMetadataStorage,
  OperationMetadataDefinition,
} from "./../../../utils/metadata-storage";
import { MerlinGQLField } from "./field";


export function MerlinGQLResolver(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[]
): ClassDecorator;
export function MerlinGQLResolver(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  options: ObjectTypeOptions
): ClassDecorator;
export function MerlinGQLResolver(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  name: string,
  options?: ObjectTypeOptions
): ClassDecorator;
export function MerlinGQLResolver(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  nameOrOptions?: string | ObjectTypeOptions,
  maybeOptions?: ObjectTypeOptions
): ClassDecorator {
  return (target) => {
    const merlinGqlMetadataStorage = getMerlinMetadataStorage();
    //Class with applied decorator
    const superClass = Object.getPrototypeOf(target);
    const superClassName = superClass.name;
    //Get BaseModel Class
    const baseSuperClassName = Object.getPrototypeOf(superClass).name;

    const metadataEntry = merlinGqlMetadataStorage.objectTypes[superClassName];
    if (metadataEntry) {
      metadataEntry.extends = baseSuperClassName;
      metadataEntry.operations = operations.map(o => typeof o === 'string' ? { type: o, secure: false } : o);
    } else {
      merlinGqlMetadataStorage.objectTypes = {
        ...merlinGqlMetadataStorage.objectTypes,
        ...{
          [superClassName]: {
            fields: [],
            extends: baseSuperClassName,
            operations: operations,
          },
        },
      };
    }
    return TypeGraphQLObjectType(
      nameOrOptions as any,
      maybeOptions
    )(superClass);
  };
}

/**
 *
 * @deprecated it will be removed in version 1.1.0, you should use ```@MerlinGQLResolver``` instead
 */
export function ObjectType(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[]
): ClassDecorator;
export function ObjectType(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  options: ObjectTypeOptions
): ClassDecorator;
export function ObjectType(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  name: string,
  options?: ObjectTypeOptions
): ClassDecorator;
export function ObjectType(
  operations: (CrudOperationsAndAll | OperationMetadataDefinition)[],
  nameOrOptions?: string | ObjectTypeOptions,
  maybeOptions?: ObjectTypeOptions
): ClassDecorator {
  return (target) => {
    return MerlinGQLResolver(
      operations,
      nameOrOptions as any,
      maybeOptions
    )(target);
  };
}
