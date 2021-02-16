import { Field as TypeGraphQLField, FieldOptions } from "type-graphql";
import {
  MethodAndPropDecorator,
  ReturnTypeFunc
} from "type-graphql/dist/decorators/types";
import {
  addFieldMetadata
} from "../../../utils/metadata-storage";
import { getEntityNameFromSublass } from "./utils";

/**
 *
 * @deprecated it will be removed in version 1.1.0, you should use @MerlinGQLField instead
 */
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
    //Field with applied decorator
    const superClass = Object.getPrototypeOf(prototype);
    const keyName = getEntityNameFromSublass(prototype, !!isNotInheritance);
    addFieldMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
    return TypeGraphQLField(
      returnTypeFuncOrOptions as ReturnTypeFunc,
      maybeOptions
    )(superClass, propertyKey, descriptor);
  };
}

export const MerlinGQLField = Field;
