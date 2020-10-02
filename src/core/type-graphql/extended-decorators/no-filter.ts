import { getMerlinMetadataStorage } from "../../../utils/metadata-storage";

export const NoFilter = () => {
  return (prototype: any, propertyKey: any, descriptor: any) => {
    const merlinGqlMetadataStorage = getMerlinMetadataStorage();
    const keyName = Object.getPrototypeOf(prototype).constructor.name;
    const existentMetadataForPrototype =
      merlinGqlMetadataStorage.objectTypes[keyName];
    if (existentMetadataForPrototype) {
      existentMetadataForPrototype.fields.push({
        name: propertyKey.toString(),
        ignoreSort: false,
        ignoreFilter: true,
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
                ignoreFilter: true,
              },
            ],
            extends: null,
          },
        },
      };
    }
    //Wrap typegraphql field decorator
  };
};
