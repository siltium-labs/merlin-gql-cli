declare global {
  namespace NodeJS {
    interface Global {
      MerlinGQLMetadataStorage: MerlinGQLMetadataStorage;
    }
  }
}
export type ObjectTypeMetadata = String;
export class MerlinGQLMetadataStorage {
  objectTypes: ObjectTypeMetadata[] = [];
}

export const getMetadataStorage = (): MerlinGQLMetadataStorage => {
  return (
    global.MerlinGQLMetadataStorage ||
    (global.MerlinGQLMetadataStorage = new MerlinGQLMetadataStorage())
  );
};
