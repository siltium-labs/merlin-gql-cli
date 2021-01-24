import { addNoSortMetadata } from "./../../../utils/metadata-storage";

export const NoSort = (): PropertyDecorator => {
  return (prototype, propertyKey): void => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoSortMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};
