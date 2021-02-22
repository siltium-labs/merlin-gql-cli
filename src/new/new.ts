import { ConfigFileTemplate } from "./templates/example/templates/config.development.json";
import { OrmConfigTemplate } from "./templates/example/templates/ormconfig.json";
import { READMEmdTemplate } from "./templates/global/templates/README.md";
import fs from "fs";
import Listr from "listr";
import { emoji } from "node-emoji";
import path from "path";
import { spawnCommand } from "./cmd";
import { generateDependencies, generateDevDependencies } from "./dependencies";
import {
  NewProjectConfig,
  NewProjectTemplatesEnum,
  TemplateArgsDictionary,
} from "./new.config";
import { ncp } from "ncp";
import * as Prettier from "prettier";
import { TypeormDatabaseTypes } from "../commands/new";
import { CategoryModelTemplate, PersonModelTemplate, ProductModelTemplate, UserModelTemplate } from "./templates/example/templates/models";

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
  [key: string]: any;
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
          await createPackageJson(
            config.name,
            context.projectPath,
            config.templateArgs
          );
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
            config.templateArgs,
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
            config.templateArgs,
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
          await generateTypeORMModels(
            config.templateArgs.database,
            context.projectPath
          )
          await copyTemplateToProjectFolder(
            config.template,
            context.projectPath
          );
          await generateReadmeFile(config.name, context.projectPath);
          await generateOrmConfigFile(
            context.projectPath,
            config.ormConfigParams
          );
          await generateConfigFile(
            context.projectPath,
            {
              jwtSecret: config.jwtSecret,
            }
          );

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

const createPackageJson = (
  appName: string,
  appPath: string,
  templateArs: TemplateArgsDictionary
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const packageDotJsonObjectContent: {
        name: string;
        version: string;
        scripts: { [key: string]: string };
      } = {
        name: kebabCase(appName),
        version: "0.1.0",
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
          start: `env PORT=4000 gulp`
        },
      };
      if (templateArs["ngrok"]) {
        packageDotJsonObjectContent.scripts = {
          ...packageDotJsonObjectContent.scripts,
          ngrok: "ngrok http 4000",
        };
      }
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
  templateArgs: TemplateArgsDictionary,
  appPath: string
): Promise<void> => {
  try {
    await spawnCommand(
      npmCommandName,
      ["i", "-s", ...generateDependencies(template, templateArgs)],
      appPath,
      true
    );
  } catch (e) {
    throw new Error(e);
  }
};

const runNpmInstallForDevDependencies = async (
  template: NewProjectTemplatesEnum,
  templateArgs: TemplateArgsDictionary,
  appPath: string
): Promise<void> => {
  try {
    await spawnCommand(
      npmCommandName,
      ["i", "-D", ...generateDevDependencies(template, templateArgs)],
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

      const rendered = READMEmdTemplate(appName);
      const readmeDestinationPath = path.join(appPath, "README.md");
      writeFile(rendered, readmeDestinationPath, { parser: "markdown" });
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const generateTypeORMModels = async (
  databaseType: TypeormDatabaseTypes,
  appPath: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      //Generate Users Model
      const usersRendered = UserModelTemplate(databaseType);
      const usersModelFolder = path.join(appPath, "src", "models", "user");
      if (!fs.existsSync(usersModelFolder)) {
        fs.mkdirSync(usersModelFolder, { recursive: true })
      }
      const usersModelDestinationPath = path.join(usersModelFolder, "user.model.ts");
      writeFile(usersRendered, usersModelDestinationPath);

      //Generate Person Model
      const personsRendered = PersonModelTemplate(databaseType);
      const personsModelFolder = path.join(appPath, "src", "models", "person");
      if (!fs.existsSync(personsModelFolder)) {
        fs.mkdirSync(personsModelFolder, { recursive: true })
      }
      const personModelDestinationPath = path.join(personsModelFolder, "person.model.ts");
      writeFile(personsRendered, personModelDestinationPath);

      //Generate Category Model
      const categoriesRendered = CategoryModelTemplate(databaseType);
      const categoriesModelFolder = path.join(appPath, "src", "models", "category");
      if (!fs.existsSync(categoriesModelFolder)) {
        fs.mkdirSync(categoriesModelFolder, { recursive: true })
      }
      const categoriesDestinationPath = path.join(categoriesModelFolder, "category.model.ts");
      writeFile(categoriesRendered, categoriesDestinationPath);

      //Generate Product Model
      const productsRendered = ProductModelTemplate(databaseType);
      const productsModelFolder = path.join(appPath, "src", "models", "product");
      if (!fs.existsSync(productsModelFolder)) {
        fs.mkdirSync(productsModelFolder, { recursive: true })
      }
      const productsDestinationPath = path.join(productsModelFolder, "product.model.ts");
      writeFile(productsRendered, productsDestinationPath);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const generateOrmConfigFile = async (
  appPath: string,
  configParams: OrmConfigTemplateParams
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const rendered = OrmConfigTemplate(configParams);
      const ormConfigDestinationPath = path.join(appPath, "ormconfig.json");
      writeFile(rendered, ormConfigDestinationPath, { parser: "json" });
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const generateConfigFile = async (
  appPath: string,
  configParams: ConfigTemplateParams
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const rendered = ConfigFileTemplate(configParams.jwtSecret);
      const configDestinationPath = path.join(
        appPath,
        "config.development.json"
      );
      writeFile(rendered, configDestinationPath, { parser: "json" });
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

const prettierDefaultOptions: Prettier.Options = {
  parser: "typescript",
  endOfLine: "auto",
  tabWidth: 4,
  printWidth: 200,
};

const writeFile = (rendered: any, filePath: string, prettierOptions?: Partial<Prettier.Options>) => {
  let formatted = "";
  try {
    formatted = Prettier.format(rendered, { ...prettierDefaultOptions, ...prettierOptions ?? {} });
  } catch (error) {
    console.error("There were some problems with model generation");
    console.error(error);
    formatted = rendered;
  }

  fs.writeFileSync(filePath, formatted, {
    encoding: "utf-8",
    flag: "w",
  });
};
