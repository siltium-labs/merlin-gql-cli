import { addNoCreateInputMetadata, addNoSortMetadata, addNoUpdateInputMetadata } from "../../../utils/metadata-storage";

export const NoCreateInput = (): PropertyDecorator => {
  return (prototype, propertyKey): void => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoCreateInputMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};

export const NoUpdateInput = (): PropertyDecorator => {
  return (prototype, propertyKey): void => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoUpdateInputMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};

export const NoInput = (): PropertyDecorator => {
  return (prototype, propertyKey): void => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoCreateInputMetadata(keyName, propertyKey.toString());
    addNoUpdateInputMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};
