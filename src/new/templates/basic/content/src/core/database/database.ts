import { SnakeNamingStrategy } from "./snake-naming-strategy";
import { getCurrentEnvironmentalConfig } from "./../env/env";
import { createConnection, Connection, getConnectionOptions } from "typeorm";

export const initializeDatabase = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await getCurrentEnvironmentalConfig();
      try {
        const connectionOptions = await getConnectionOptions();
        const overridenOptions = {
          ...connectionOptions,
          namingStrategy: new SnakeNamingStrategy(),
        };

        await createConnection(overridenOptions as any);

        resolve();
      } catch (e) {
        reject(e);
      }
    } catch (e) {
      reject(e);
    }
  });
};
