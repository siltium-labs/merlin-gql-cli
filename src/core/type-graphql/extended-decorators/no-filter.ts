import { addNoFilterMetadata } from "./../../../utils/metadata-storage";
import { getMerlinMetadataStorage } from "../../../utils/metadata-storage";

export const NoFilter = (): MethodDecorator | PropertyDecorator => {
  return (prototype, propertyKey, _) => {
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    addNoFilterMetadata(keyName, propertyKey.toString());
    //Wrap typegraphql field decorator
  };
};
