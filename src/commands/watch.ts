import {
  getMerlinMetadataStorage,
  getWatchedFiles,
} from "./../utils/metadata-storage";
import { loadResolverFiles } from "./../core/schema/schema";
import LocalCommand from "./core/local-command";
import fs from "fs";
import cli from "cli-ux";
import { Connection } from "typeorm";
import { gatherModelsInfo, getConnection } from "./generate/crud";
import { makeDefaultConfigs } from "../db-reverse";
import generator from "../db-reverse/generation/model-generation";

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

const watchFileChanges = (filePaths: string[], cb: (err?: Error) => void) => {
  filePaths.map((filePath) => {
    let previousContent = "";
    setInterval(async () => {
      const newContent = await readContent(filePath);
      const filteredContent = newContent.replace(previousContent, "");
      if (filteredContent !== "") {
        cb();
      }
      previousContent = newContent;
    }, 3000);
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

const IndefinitelyForChanges = () =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, 99999);
  });

export default class DBReverse extends LocalCommand {
  static description = `watch`;

  static flags = {};

  async run() {
    const connection: Connection | null = await getConnection();
    try {
      this.checks();
      const { args, flags } = this.parse(DBReverse);
      //loadMetadata
      await loadResolverFiles();

      const watchedFiles = getWatchedFiles();

      const changesTracker = watchFileChanges(watchedFiles, async () => {
        await generateCrudFiles(connection);
      });
      cli.action.start("Awaiting changes");
      await IndefinitelyForChanges();
      cli.action.stop();
    } catch (e) {
      this.error(e);
    } finally {
      connection.close();
    }
  }
}
