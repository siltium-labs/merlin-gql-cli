import fs from "fs";
import Listr from "listr";
import { emoji } from "node-emoji";
import path from "path";
import { spawnCommand } from "./cmd";
import { generateDependencies, generateDevDependencies } from "./dependencies";
import { NewProjectConfig, NewProjectTemplatesEnum } from "./new.config";
import { ncp } from "ncp";
import handlebars from "handlebars";

export const kebabCase = (str: string) =>
  str
    .match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )!
    .map((x) => x.toLowerCase())
    .join("-");

type TasksContext = {
  projectPath: string;
};

type ReadmeTemplateParams = {
  appName: string;
};

export type OrmConfigTemplateParams = {
  database: {
    type: string;
    name: string;
    user: string;
    password: string;
    host: string;
    port: string;
  };
};

export type ConfigTemplateParams = {
  jwtSecret?: string;
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
        try {
          await createPackageJson(config.name, context.projectPath);
          task.title = `Package.json created ${emoji.white_check_mark}`;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
    {
      title: `Install dependencies`,
      task: async (context: TasksContext, task) => {
        try {
          task.title = `Installing dependencies... This might take a couple of minutes, you can go grab a ${emoji.coffee}`;
          await runNpmInstallForDependencies(
            config.template,
            context.projectPath
          );
          task.title = `Dependencies installed ${emoji.white_check_mark}`;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
    {
      title: `Install dev dependencies`,
      task: async (context: TasksContext, task) => {
        try {
          task.title = `Installing dev dependencies... Was the ${emoji.coffee} good?`;
          await runNpmInstallForDevDependencies(
            config.template,
            context.projectPath
          );
          task.title = `Dev dependencies installed ${emoji.white_check_mark}`;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
    {
      title: `Create project files`,
      task: async (context: TasksContext, task) => {
        try {
          task.title = `Creating project files...`;
          await copyTemplateToProjectFolder(
            config.template,
            context.projectPath
          );
          await generateReadmeFile(config.name, context.projectPath);
          await generateOrmConfigFile(
            config.template,
            context.projectPath,
            config.ormConfigParams
          );
          await generateConfigFile(config.template, context.projectPath, {
            jwtSecret: config.jwtSecret,
          });
          task.title = `Project files created ${emoji.white_check_mark}`;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
  ]);
  await tasks.run();
};

//returns the full path of the created project
const createProjectFolder = (appName: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const currentFolder = process.cwd();
      const appPath = path.join(currentFolder, kebabCase(appName));
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
    } catch (e) {
      reject(e);
    }
  });
};

const createPackageJson = (appName: string, appPath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const packageDotJsonObjectContent = {
        name: kebabCase(appName),
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
    } catch (e) {
      reject(e);
    }
  });
};

const npmCommandName = /^win/.test(process.platform) ? "npm.cmd" : "npm";

const runNpmInstallForDependencies = async (
  template: NewProjectTemplatesEnum,
  appPath: string
): Promise<void> => {
  try {
    await spawnCommand(
      npmCommandName,
      ["i", "-s", ...generateDependencies(template)],
      appPath,
      true
    );
  } catch (e) {
    throw new Error(e);
  }
};

const runNpmInstallForDevDependencies = async (
  template: NewProjectTemplatesEnum,
  appPath: string
): Promise<void> => {
  try {
    await spawnCommand(
      npmCommandName,
      ["i", "-D", ...generateDevDependencies(template)],
      appPath,
      true
    );
  } catch (e) {
    throw new Error(e);
  }
};

const copyTemplateToProjectFolder = async (
  template: NewProjectTemplatesEnum,
  appPath: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const templatePath = path.join(
        __dirname,
        "templates",
        template,
        "content"
      );
      ncp(templatePath, appPath, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};

const generateReadmeFile = async (
  appName: string,
  appPath: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const readmeTemplatePath = path.join(
        __dirname,
        "templates",
        "global",
        "handlebars",
        "README.md.handlebars"
      );
      const readmeSource = fs.readFileSync(readmeTemplatePath, "utf-8");
      const readme = handlebars.compile<ReadmeTemplateParams>(readmeSource);
      const readmeFileContent = readme({
        appName,
      });
      const readmeDestinationPath = path.join(appPath, "README.md");
      fs.writeFileSync(readmeDestinationPath, readmeFileContent);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const generateOrmConfigFile = async (
  template: NewProjectTemplatesEnum,
  appPath: string,
  configParams: OrmConfigTemplateParams
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const ormConfigTemplatPath = path.join(
        __dirname,
        "templates",
        template,
        "handlebars",
        "ormconfig.json.handlebars"
      );
      const ormConfigSource = fs.readFileSync(ormConfigTemplatPath, "utf-8");
      const ormConfig = handlebars.compile<OrmConfigTemplateParams>(
        ormConfigSource
      );
      const ormConfigFileContent = ormConfig(configParams);
      const ormConfigDestinationPath = path.join(appPath, "ormconfig.json");
      fs.writeFileSync(ormConfigDestinationPath, ormConfigFileContent);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const generateConfigFile = async (
  template: NewProjectTemplatesEnum,
  appPath: string,
  configParams: ConfigTemplateParams
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const configTemplatPath = path.join(
        __dirname,
        "templates",
        template,
        "handlebars",
        "config.development.json.handlebars"
      );
      const configSource = fs.readFileSync(configTemplatPath, "utf-8");
      const config = handlebars.compile<ConfigTemplateParams>(configSource);
      const configFileContent = config(configParams);
      const configDestinationPath = path.join(
        appPath,
        "config.development.json"
      );
      fs.writeFileSync(configDestinationPath, configFileContent);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};
