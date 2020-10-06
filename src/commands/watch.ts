import { getMerlinMetadataStorage, getWatchedFiles } from "./../utils/metadata-storage";
import { loadResolverFiles } from "./../core/schema/schema";
import LocalCommand from "./core/local-command";
import fs from "fs";
import cli from "cli-ux";

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

const IndefinitelyForChanges = () =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, 99999);
  });

export default class DBReverse extends LocalCommand {
  static description = `watch`;

  static flags = {};

  async run() {
    try {
      this.checks();
      const { args, flags } = this.parse(DBReverse);
      //loadMetadata
      await loadResolverFiles();
      console.log(getMerlinMetadataStorage())
      const watchedFiles = getWatchedFiles();
      console.log(watchedFiles);
      const changesTracker = watchFileChanges(watchedFiles, () => {
        console.log("file changed");
      });
      cli.action.start("Awaiting changes");
      await IndefinitelyForChanges();
      cli.action.stop();
    } catch (e) {
      this.error(e);
    }
  }
}
