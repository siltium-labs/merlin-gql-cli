import { addNoFilterMetadata } from "./../../../utils/metadata-storage";

export const NoFilter = (): PropertyDecorator => {
  return (prototype, propertyKey): void => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoFilterMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};
