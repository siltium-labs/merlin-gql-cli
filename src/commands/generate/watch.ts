
import { findFileNamesFromGlob, getMerlinGqlConfigResolversPath, loadOtFiles } from "@merlin-gql/core";
import LocalCommand from "../core/local-command";
import fs from "fs";
import { Connection } from "typeorm";
import { getConnection } from "../generate/crud";
import { exec } from "child_process";
import ora from "ora";
import path from "path";

const watchFileChanges = (filePatterns: string[], cb: (err?: Error) => void) => {
  const pathsDictionary: { [path: string]: number } = {};

  setInterval(() => {
    let somethingChanged = false;
    let filePaths = filePatterns.reduce((acc:string[], current) => ([...acc, ...findFileNamesFromGlob(current)]), []);
    filePaths.map((filePath) => {
      const { size } = fs.statSync(filePath);
      const didChange = !pathsDictionary[filePath] || pathsDictionary[filePath] !== size;
      if (didChange) {
        somethingChanged = true;
      }
      pathsDictionary[filePath] = size;
    })
    if (somethingChanged) {
      cb();
    }
  }, 3000)

};

const IndefinitelyForChanges = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 1000 * 60 * 60 * 24);
  });

export default class Watch extends LocalCommand {
  static description = `watch`;

  static flags = {};

  async run() {
    const connection: Connection | null = await getConnection();
    try {
      this.checks();
      const { args, flags } = this.parse(Watch);
      //loadMetadata
      await loadOtFiles();
      const merlinGqlResolverGeneratorsPath = await getMerlinGqlConfigResolversPath()
      const watchedFilesGlobExpression: string[] = merlinGqlResolverGeneratorsPath.map(p => (path.join(process.cwd(), "dist") + "/" + p).replace("\\", "/"));
      const spinner = ora("Awaiting changes...")
      spinner.start();
      const changesTracker = watchFileChanges(watchedFilesGlobExpression, async () => {
        spinner.text = "Changes detected, generating files...";
        exec("npx @merlin-gql/cli generate:all", () => {
          spinner.text = "Awaiting changes..."
        })
      });

      await IndefinitelyForChanges();
    } catch (e) {
      this.error(e);
    } finally {
      connection.close();
    }
  }
}
