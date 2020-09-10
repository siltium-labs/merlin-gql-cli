import { emoji } from "node-emoji";
import { spawnCommand } from "./cmd";
import { NewProjectConfig, NewProjectTemplatesEnum } from "./new.config";
import Listr, { ListrTask } from "listr";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { generateDependencies, generateDevDependencies } from "./dependencies";
import { Observable } from "rxjs";

type TasksContext = {
  projectPath: string;
};

export const createNew = async (config: NewProjectConfig) => {
  const tasks = new Listr([
    {
      title: "Create project folder",
      task: async (context: TasksContext, task) => {
        try {
          const projectPath = await createProjectFolder(config.name);
          context.projectPath = projectPath;
          task.title = `Project folder created ${emoji.white_check_mark}`;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
    {
      title: "Create package.json",
      task: async (context: TasksContext, task) => {
        const projectPath = await createPackageJson(
          config.name,
          context.projectPath
        );
        task.title = `Package.json created ${emoji.white_check_mark}`;
      },
    },
    {
      title: `Install dependencies`,
      task: async (context: TasksContext, task) => {
        task.title = `Installing dependencies... Might take a couple if minutes, you can go grab a ${emoji.coffee}`;
        await runNpmInstallForDependencies(
          config.template,
          context.projectPath
        );
        task.title = `Dependencies installed ${emoji.white_check_mark}`;
      },
    },
    {
      title: `Install dev dependencies`,
      task: async (context: TasksContext, task) => {
        task.title = `Installing dev dependencies... Was the ${emoji.coffee} good?`;
        await runNpmInstallForDevDependencies(
          config.template,
          context.projectPath
        );
        task.title = `Dev dependencies installed ${emoji.white_check_mark}`;
      },
    },
  ]);
  await tasks.run();
};

const checkIfFolderIsEmpty = () => {
  const folder = process;
};

//returns the full path of the created project
const createProjectFolder = (appName: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const currentFolder = process.cwd();
    const appPath = path.join(currentFolder, appName);
    const folderAlreadyExists = fs.existsSync(appPath);
    if (folderAlreadyExists) {
      return reject("There is already a folder called " + appName);
    }
    fs.mkdir(appPath, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(appPath);
    });
  });
};

const createPackageJson = (appName: string, appPath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const packageDotJsonObjectContent = {
      name: appName,
      version: "0.1.0",
    };
    const packajeDotJsonPath = path.join(appPath, "package.json");
    const packageDotJsonContent = JSON.stringify(
      packageDotJsonObjectContent,
      null,
      1
    );
    fs.writeFile(
      packajeDotJsonPath,
      packageDotJsonContent,
      {
        encoding: "utf-8",
      },
      (err) => {
        if (err) {
          return reject(err);
        } else return resolve();
      }
    );
  });
};

const npmCommandName = /^win/.test(process.platform) ? "npm.cmd" : "npm";

const runNpmInstallForDependencies = async (
  template: NewProjectTemplatesEnum,
  appPath: string
): Promise<void> => {
  await spawnCommand(
    npmCommandName,
    ["i", "-s", ...generateDependencies(template)],
    appPath,
    true
  );
};

const runNpmInstallForDevDependencies = async (
  template: NewProjectTemplatesEnum,
  appPath: string
): Promise<void> => {
  await spawnCommand(
    npmCommandName,
    ["i", "-D", ...generateDevDependencies(template)],
    appPath,
    true
  );
};

const wait = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
