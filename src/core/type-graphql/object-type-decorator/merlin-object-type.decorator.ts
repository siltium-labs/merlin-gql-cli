import { getMerlinMetadataStorage } from "../../../utils/metadata-storage";
import { getMetadataStorage, ObjectType } from "type-graphql";
import { ObjectTypeOptions } from "type-graphql";
import { getNameDecoratorParams } from "type-graphql/dist/helpers/decorators";

export function MerlinObjectType(): ClassDecorator;
export function MerlinObjectType(options: ObjectTypeOptions): ClassDecorator;
export function MerlinObjectType(
  name: string,
  options?: ObjectTypeOptions
): ClassDecorator;
export function MerlinObjectType(
  nameOrOptions?: string | ObjectTypeOptions,
  maybeOptions?: ObjectTypeOptions
): ClassDecorator {
  const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
  const interfaceClasses =
    options.implements && ([] as Function[]).concat(options.implements);
  return (target) => {
    getMerlinMetadataStorage().objectTypes.push(target);
    getMetadataStorage().collectObjectMetadata({
      name: name || target.name,
      target,
      description: options.description,
      interfaceClasses,
      isAbstract: options.isAbstract,
      simpleResolvers: options.simpleResolvers,
    });
  };
}
