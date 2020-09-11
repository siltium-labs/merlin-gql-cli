import { Column } from "./../../db-reverse/models/column";
import { Command } from "@oclif/command";
import {
  createConnection,
  ConnectionOptionsReader,
  EntityMetadata,
  ColumnType,
} from "typeorm";
import { cli } from "cli-ux";
import { Entity } from "../../db-reverse/library";
import { makeDefaultConfigs } from "../../db-reverse";
import modelCustomizationPhase from "../../db-reverse/generation/model-customization";
import { modelGenerationCodeFirst } from "../../db-reverse/generation/model-generation";

export default class EntitiesList extends Command {
  static aliases = ["l"];
  static description = "Lists all typeorm existing entities";

  static examples = [`$ merlin-gql list:entities`];

  static flags = {};

  static args = [];

  async run() {
    cli.action.start("Reading metadata...");
    let entities = await gatherModelsInfo();    
    
    cli.table(entities, {
      name: { minWidth: 10 },
      relations: { minWidth: 10 },
    });
  }
}

const gatherModelsInfo = async () => {
  const connectionOptionsReader = new ConnectionOptionsReader({
    root: process.cwd(),
    configName: "ormconfig",
  });

  const connectionOptions = {
    ...(await connectionOptionsReader.get("default")),
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: false,
  };

  const connection = await createConnection(connectionOptions);
  const entities = connection.entityMetadatas.map((m) => ({
    name: m.name,
    relations: `[${m.relations.map((r) => (r.type as any).name).join(", ")}]`,
  }));

 
  return entities;
};

