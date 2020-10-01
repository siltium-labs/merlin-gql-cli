import { getMerlinMetadataStorage } from "../../../utils/metadata-storage";
import { FieldOptions } from "type-graphql";
import {
  MethodAndPropDecorator,
  ReturnTypeFunc,
} from "type-graphql/dist/decorators/types";
import { Field as TypeGraphQLField } from "type-graphql";

export function Field(): MethodAndPropDecorator;
export function Field(options: FieldOptions): MethodAndPropDecorator;
export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: FieldOptions,
  isNotInheritance?: boolean
): MethodAndPropDecorator;
export function Field(
  returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions,
  maybeOptions?: FieldOptions,
  isNotInheritance?: boolean
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    const merlinGqlMetadataStorage = getMerlinMetadataStorage();
    const keyName = isNotInheritance
      ? prototype.constructor.name
      : Object.getPrototypeOf(prototype).constructor.name;
    const existentMetadataForPrototype =
      merlinGqlMetadataStorage.objectTypes[keyName];
    if (existentMetadataForPrototype) {
      existentMetadataForPrototype.fields.push({
        name: propertyKey.toString(),
        ignoreSort: false,
        ignoreFilter: false,
      });
    } else {
      merlinGqlMetadataStorage.objectTypes = {
        ...merlinGqlMetadataStorage.objectTypes,
        ...{
          [keyName]: {
            fields: [
              {
                name: propertyKey.toString(),
                ignoreSort: false,
                ignoreFilter: false,
              },
            ],
            extends: null,
          },
        },
      };
    }
    //Wrap typegraphql field decorator
    return TypeGraphQLField(
      returnTypeFuncOrOptions as ReturnTypeFunc,
      maybeOptions
    )(prototype, propertyKey, descriptor);
  };
}
