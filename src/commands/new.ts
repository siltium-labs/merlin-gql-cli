import { OrmConfigTemplateParams } from "./../new/new";
import { createNew } from "../new/new";
import { Command, flags } from "@oclif/command";
import inquirer from "inquirer";
import {
  NewProjectTemplatesEnum,
  NewProjectConfig,
  TemplateArgsDictionary,
} from "../new/new.config";
import chalk from "chalk";
import { emoji } from "node-emoji";
import { snakeCase } from "change-case";

export type TypeormDatabaseTypes =
  | "mysql"
  | "postgres"
  | "mariadb"
  | "oracle"
  | "mssql"
// TODO: Add mongodb support
//  | "mongodb";

const toTitleCase = (str: string) =>
  str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const generateRandomJWTSecret = (length: number) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

enum DatabaseTypesEnum {
  Mysql = "mysql",
  Postgres = "postgres",
  Mariadb = "mariadb",
  Oracle = "oracle",
  Mssql = "mssql",
  // TODO: Add mongodb support
  //  MongoDB = "mongodb"
}

interface IDatabaseDefaultValues {
  port: number;
  username: string;
}

export const DatabaseDefaultValuesEnum: { [key: string]: IDatabaseDefaultValues } = {
  [DatabaseTypesEnum.Mysql]: {
    port: 3306,
    username: 'root'
  },
  [DatabaseTypesEnum.Mariadb]: {
    port: 3306,
    username: 'root'
  },
  [DatabaseTypesEnum.Postgres]: {
    port: 5432,
    username: 'postgres'
  },
  [DatabaseTypesEnum.Mssql]: {
    port: 1433,
    username: 'sa'
  },
  [DatabaseTypesEnum.Oracle]: {
    port: 1521,
    username: 'oracle'
  },
  // TODO: Add mongodb support
  /*[DatabaseTypesEnum.MongoDB]: {
    port: 27017,
    username: 'admin'
  }*/
}

export default class New extends Command {
  static aliases = ["new"];

  static description = `creates a new merlin-gql project.\n
  Usage: merlin-gql new -t example -n myProject\n
  You can also run program without specifying any parameters to launch interactive mode.`;

  static flags = {
    help: flags.help(),

    template: flags.string({
      name: "template",
      char: "t",
      description: "Template",
      options: ["basic", "example"],

      //default: connectionOptions.host,
    }),
    name: flags.string({
      name: "name",
      char: "n",
      description: "Name of the project",

      //default: connectionOptions.host,
    }),
    databaseType: flags.string({
      name: "database-type",
      char: "t",
      description: "Database Type",

      //default: connectionOptions.host,
    }),
    databaseName: flags.string({
      name: "database-name",
      char: "d",
      description: "Database Name",

      //default: connectionOptions.host,
    }),
    databaseHost: flags.string({
      name: "database-host",
      char: "h",
      description: "Database Host",

      //default: connectionOptions.host,
    }),
    databasePort: flags.string({
      name: "database-port",
      char: "p",
      description: "Database Port",

      //default: connectionOptions.host,
    }),
    databaseUser: flags.string({
      name: "database-user",
      char: "u",
      description: "Database User",

      //default: connectionOptions.host,
    }),
    databasePassword: flags.string({
      name: "database-password",
      char: "p",
      description: "Database Password",

      //default: connectionOptions.host,
    }),
    jwtSecretToken: flags.string({
      name: "jwt-secret-token",
      char: "s",
      description: "Secret JWT Encryption Token",

      //default: connectionOptions.host,
    }),
    ngrok: flags.boolean({
      name: "ngrok",
      description: "Enable ngrok for remote testing",

      //default: connectionOptions.host,
    }),
  };


  async run() {
    const { args, flags } = this.parse(New);
    if (!flags.template) {
      const {
        template,
      }: { template: NewProjectTemplatesEnum } = await inquirer.prompt([
        {
          name: "template",
          message: `Select a starting template for your project`,
          type: "list",
          choices: [
            {
              name: `${toTitleCase(
                NewProjectTemplatesEnum.Basic
              )} - Contains only the very minimum required files to start.`,
              value: NewProjectTemplatesEnum.Basic,
            },
            {
              name: `${toTitleCase(
                NewProjectTemplatesEnum.Example
              )} - Showcases basic functionality examples. For more info check https://github.com/silentium-labs/merlin-gql-cli`,
              value: NewProjectTemplatesEnum.Example,
            },
          ],
        },
      ]);
      flags.template = template;
    }
    if (!flags.name) {
      const { name }: { name: string } = await inquirer.prompt([
        {
          name: "name",
          message: `Enter the name of your project without spaces`,
          type: "input",
        },
      ]);
      flags.name = name.trim();
    }

    if (!flags.databaseType) {
      const {
        databaseType,
      }: { databaseType: TypeormDatabaseTypes } = await inquirer.prompt([
        {
          name: "databaseType",
          message: `Select the type of database for your project`,
          type: "list",
          choices: [
            DatabaseTypesEnum.Mysql,
            DatabaseTypesEnum.Postgres,
            // TODO: Add mongodb support
            //DatabaseTypesEnum.MongoDB,
            DatabaseTypesEnum.Mssql,
            DatabaseTypesEnum.Mariadb,
            DatabaseTypesEnum.Oracle
          ],
        },
      ]);
      flags.databaseType = databaseType;
    }
    if (!flags.databaseName) {
      const { databaseName }: { databaseName: string } = await inquirer.prompt([
        {
          name: "databaseName",
          message: `Enter the database name`,
          type: "input",
          default: snakeCase(flags.name.toLowerCase())
        },
      ]);
      flags.databaseName = databaseName.trim();
    }


    if (!flags.databaseHost) {
      const { databaseHost }: { databaseHost: string } = await inquirer.prompt([
        {
          name: "databaseHost",
          message: `Enter the database host`,
          type: "input",
          default: "127.0.0.1"
        },
      ]);
      flags.databaseHost = databaseHost.trim();
    }
    if (!flags.databasePort) {
      const { databasePort }: { databasePort: string } = await inquirer.prompt([
        {
          name: "databasePort",
          message: `Enter the database port`,
          type: "input",
          default: DatabaseDefaultValuesEnum[flags.databaseType]?.port.toString()
        },
      ]);
      flags.databasePort = databasePort.trim();
    }
    if (!flags.databaseUser) {
      const { databaseUser }: { databaseUser: string } = await inquirer.prompt([
        {
          name: "databaseUser",
          message: `Enter the database user`,
          type: "input",
          default: DatabaseDefaultValuesEnum[flags.databaseType]?.username
        },
      ]);
      flags.databaseUser = databaseUser.trim();
    }
    if (!flags.databasePassword) {
      const {
        databasePassword,
      }: { databasePassword: string } = await inquirer.prompt([
        {
          name: "databasePassword",
          message: `Enter the database password`,
          type: "password",
        },
      ]);
      flags.databasePassword = databasePassword;
    }
    if (
      !flags.jwtSecretToken &&
      flags.template === NewProjectTemplatesEnum.Example
    ) {
      const {
        jwtSecretToken,
      }: { jwtSecretToken: string } = await inquirer.prompt([
        {
          name: "jwtSecretToken",
          message: `Enter a secret for your JWT token generation or press enter to randomly generate one`,
          type: "input",
        },
      ]);
      flags.jwtSecretToken =
        jwtSecretToken && jwtSecretToken !== "" ? jwtSecretToken : generateRandomJWTSecret(30);
    }
    if (!flags.ngrok) {
      const { ngrok }: { ngrok: boolean } = await inquirer.prompt([
        {
          name: "ngrok",
          message: `Do you want to enable ngrok to allow for remote testing? (Recommended for mobile)`,
          type: "confirm",
        },
      ]);
      flags.ngrok = ngrok;
    }
    const ormConfigParams: OrmConfigTemplateParams = {
      database: {
        type: flags.databaseType,
        name: flags.databaseName,
        user: flags.databaseUser,
        password: flags.databasePassword,
        host: flags.databaseHost,
        port: flags.databasePort,
      },
    };
    const templateArgs: TemplateArgsDictionary = { database: flags.databaseType as TypeormDatabaseTypes };
    if (flags.template === NewProjectTemplatesEnum.Example) {
      templateArgs["ngrok"] = flags.ngrok;
    }

    const config: NewProjectConfig = {
      template: flags.template as NewProjectTemplatesEnum,
      templateArgs: templateArgs,
      name: flags.name,
      ormConfigParams,
      jwtSecret: flags.jwtSecretToken,
    };
    await createNew(config);
    this.log(
      `${chalk.cyan.bold("Project created successfully")} ${emoji.rocket}`
    );
  }
}
