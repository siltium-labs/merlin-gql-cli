import {
  ObjectType as TypeGraphQLObjectType,
  ObjectTypeOptions,
} from "type-graphql";
import { getMerlinMetadataStorage } from "../../../utils/metadata-storage";

export function Crud(): ClassDecorator;
export function Crud(options: ObjectTypeOptions): ClassDecorator;
export function Crud(
  name: string,
  options?: ObjectTypeOptions
): ClassDecorator;
export function Crud(
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
    } else {
      merlinGqlMetadataStorage.objectTypes = {
        ...merlinGqlMetadataStorage.objectTypes,
        ...{
          [superClass]: {
            fields: [],
            extends: baseSuperClass,
          },
        },
      };
    }
    return TypeGraphQLObjectType(nameOrOptions as any, maybeOptions)(target);
  };
}
