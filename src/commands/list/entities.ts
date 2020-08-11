import { Command } from "@oclif/command";
import { createConnection, ConnectionOptionsReader } from "typeorm";
import { cli } from "cli-ux";

export default class EntitiesList extends Command {
  static aliases = ["l"];
  static description = "Lists all typeorm existing entities";

  static examples = [`$ merlin-gql list:entities`];

  static flags = {};

  static args = [];

  async run() {
    cli.action.start("Reading metadata...");
    const entities = await gatherModelsInfo();
    cli.action.stop();

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

