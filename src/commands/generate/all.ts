import {
  getMerlinMetadataStorage,
} from "../../utils/metadata-storage";
import { loadOtFiles } from "../../core/schema/schema";
import LocalCommand from "../core/local-command";
import fs from "fs";
import cli from "cli-ux";
import { Connection } from "typeorm";
import { gatherModelsInfo, getConnection } from "./crud";
import { makeDefaultConfigs } from "../../db-reverse";
import generator from "../../db-reverse/generation/model-generation";

export const readContent = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};


const generateCrudFiles = async (connection: Connection) => {
  const objectTypes = Object.keys(getMerlinMetadataStorage().objectTypes);
  let entities = (await gatherModelsInfo(connection)).filter((e) =>
    objectTypes.includes(e.tscName)
  );
  let configOptions = makeDefaultConfigs();
  await generator(configOptions.generationOptions, entities, {
    filter: true,
    input: true,
    resolver: true,
    sort: true,
  });
};


export default class All extends LocalCommand {
  static description = `watch`;

  static flags = {};

  async run() {
    const connection: Connection | null = await getConnection();
    try {
      this.checks();
      const { args, flags } = this.parse(All);
      //loadMetadata
      await loadOtFiles();
      cli.action.start("Generating files");
      await generateCrudFiles(connection);
      cli.action.stop();
    } catch (e) {
      this.error(e);
    } finally {
      connection.close();
    }
  }
}
