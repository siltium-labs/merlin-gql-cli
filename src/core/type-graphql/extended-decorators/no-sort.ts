import { addNoSortMetadata } from "./../../../utils/metadata-storage";

export const NoSort = (): MethodDecorator | PropertyDecorator => {
  return (prototype, propertyKey, descriptor) => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoSortMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};
