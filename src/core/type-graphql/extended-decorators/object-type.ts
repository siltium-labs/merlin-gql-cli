import {
  ObjectType as TypeGraphQLObjectType,
  ObjectTypeOptions,
} from "type-graphql";
import { getMerlinMetadataStorage } from "./../../../utils/metadata-storage";

export function ObjectType(filePath: string): ClassDecorator {
  return (target) => {
    console.log("path: ", filePath);
    console.log("Creating OT factory no crud");
    const merlinGqlMetadataStorage = getMerlinMetadataStorage();
    const superClass = Object.getPrototypeOf(target).name;
    const baseSuperClass = Object.getPrototypeOf(Object.getPrototypeOf(target))
      .name;
    const metadataEntry = merlinGqlMetadataStorage.objectTypes[superClass];
    if (metadataEntry) {
      metadataEntry.extends = baseSuperClass;
      metadataEntry.filePath = filePath;
      metadataEntry.operations = ["ALL"];
    } else {
      merlinGqlMetadataStorage.objectTypes = {
        ...merlinGqlMetadataStorage.objectTypes,
        ...{
          [superClass]: {
            filePath: filePath,
            fields: [],
            extends: baseSuperClass,
            operations: "ALL",
          },
        },
      };
    }
    return TypeGraphQLObjectType()(target);
  };
}
