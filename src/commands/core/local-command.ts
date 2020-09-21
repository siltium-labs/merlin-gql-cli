import fs from "fs";
import { flags } from "@oclif/command";
import { Command } from "@oclif/command";
import path from "path";

export type PackageJSONFileContent = {
  dependencies: { [module: string]: string };
};

export const packageJsonContainsModule = (
  content: PackageJSONFileContent,
  module: string
): boolean => {
  const moduleExistsInContent =
    Object.keys(content.dependencies).indexOf(module) > -1;
  return moduleExistsInContent;
};

export default abstract class LocalCommand extends Command {
  checks() {
    this.checkIfInsideAMerlinGQLProject();
    this.checkIfOrmConfigExists();
  }

  //We gotta check if the package.json contains merlin-gql as a dependency
  private checkIfInsideAMerlinGQLProject() {
    try {
      const packageDotJsonFilePath = path.join(process.cwd(), "package.json");
      const packageDotJsonFileExists = fs.existsSync(packageDotJsonFilePath);
      if (!packageDotJsonFileExists) {
        throw new Error(
          "No package.json file was found in the project, check if you are on the root of a merlin-gql project before running the command"
        );
      }
      const packageDotJsonFileContent = JSON.parse(
        fs.readFileSync(packageDotJsonFilePath, "utf-8")
      ) as PackageJSONFileContent;
      const isMerlinGQLProject = packageJsonContainsModule(
        packageDotJsonFileContent,
        "merlin-gql"
      );
      if (!isMerlinGQLProject) {
        throw new Error(
          "You must be in the root of a merlin-gql project before running this command"
        );
      }
    } catch (e) {
      throw e;
    }
  }

  //We gotta check if the package.json contains merlin-gql as a dependency
  private checkIfOrmConfigExists() {
    try {
      //TODO: Allow renaming ormconfig or loading from a different directory, for now we will assume it is on the root of the project
      const ormConfigFilePath = path.join(process.cwd(), "ormconfig.json");
      const ormConfigFileExists = fs.existsSync(ormConfigFilePath);
      if (!ormConfigFileExists) {
        throw new Error("No ormconfig.json file was found in the project");
      }
    } catch (e) {
      throw e;
    }
  }
}
