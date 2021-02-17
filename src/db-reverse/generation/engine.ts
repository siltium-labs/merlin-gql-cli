import * as TomgUtils from "../misc/utils";
import AbstractDriver from "../drivers/abstract.driver";
import MssqlDriver from "../drivers/mssql.driver";
import MariaDbDriver from "../drivers/maria-db.driver";
import IConnectionOptions from "../options/connection-options.interface";
import IGenerationOptions from "../options/generation-options.interface";
import PostgresDriver from "../drivers/postgres.driver";
import MysqlDriver from "../drivers/mysql.driver";
import OracleDriver from "../drivers/oracle.driver";
import modelCustomizationPhase from "./model-customization";
import generator from "./model-generation";
import { Entity } from "../models/entity";
import { ModelGenerationOptions } from "../../commands/generate/crud";

export function createDriver(driverName: string): AbstractDriver {
  switch (driverName) {
    case "mssql":
      return new MssqlDriver();
    case "postgres":
      return new PostgresDriver();
    case "mysql":
      return new MysqlDriver();
    case "mariadb":
      return new MariaDbDriver();
    case "oracle":
      return new OracleDriver();
    default:
      TomgUtils.LogError("Database engine not recognized.", false);
      throw new Error("Database engine not recognized.");
  }
}

export async function createModelFromDatabase(
  driver: AbstractDriver,
  connectionOptions: IConnectionOptions,
  generationOptions: IGenerationOptions
): Promise<void> {
  let dbModel = await dataCollectionPhase(
    driver,
    connectionOptions,
    generationOptions
  );
  if (dbModel.length === 0) {
    TomgUtils.LogError(
      "Tables not found in selected database. Skipping creation of typeorm model.",
      false
    );
    return;
  }
  dbModel = modelCustomizationPhase(
    dbModel,
    generationOptions,
    driver.defaultValues
  );

  let flags: ModelGenerationOptions = {
    model: true,
    objectType: generationOptions.graphqlFiles,
    input: false,
    filter: false,
    sort: false,
    resolver: false,
  };

  generator(generationOptions, dbModel, flags);
}

export async function dataCollectionPhase(
  driver: AbstractDriver,
  connectionOptions: IConnectionOptions,
  generationOptions: IGenerationOptions
): Promise<Entity[]> {
  return driver.GetDataFromServer(connectionOptions, generationOptions);
}
