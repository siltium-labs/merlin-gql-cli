import { DatabaseType } from "./../db-reverse/options/connection-options.interface";
import { Command, flags } from "@oclif/command";
import { userInfo } from "os";
import { getDefaultConnectionOptions } from "../db-reverse/options/connection-options.interface";
import IGenerationOptions, {
  getDefaultGenerationOptions,
} from "../db-reverse/options/generation-options.interface";
import {
  makeDefaultConfigs,
  readTOMLConfig,
  DBReverseOptions,
  useInquirer,
  validateConfig,
} from "../db-reverse";
import {
  createDriver,
  createModelFromDatabase,
} from "../db-reverse/generation/engine";
import chalk from "chalk";
import { emoji } from "node-emoji";
import LocalCommand from "./core/local-command";

export interface IDBReverseFlags {
  help: void;
  host: string;
  database: string;
  user: string;
  pass: string;
  port: number;
  engine: string;
  output: string;
  schema: string;
  ssl: boolean;
  noConfig: boolean;
  cf: string;
  ce: string;
  cp: string;
  eol: string;
  pv: string;
  lazy: boolean;
  namingStrategy: string;
  relationIds: boolean;
  skipSchema: boolean;
  generateConstructor: boolean;
  disablePluralization: boolean;
  skipTables: string;
  strictMode: string;
  defaultExport: boolean;
  graphqlObjectType: boolean;
  graphqlFiles: boolean;
  secureResolvers: boolean;
  softDeleteColumn: string;
}

export default class DBReverse extends LocalCommand {
  static description = `generate models and graphql resolvers with database reverse engineering.\n
  Usage: merlin-gql db-reverse -h <host> -d <database> -p [port] -u <user> -x [password] -e [engine]\n
  You can also run program without specifying any parameters to launch interactive mode.`;

  static flags = {
    help: flags.help(),

    host: flags.string({
      char: "h",
      description: "IP address/Hostname for database server",
    }),
    database: flags.string({
      char: "d",
      description:
        "Database name. You can pass multiple values separated by comma.",
    }),
    user: flags.string({
      char: "u",
      description: "Username for database server",
    }),
    pass: flags.string({
      char: "x",
      description: "Password for database server",
    }),
    port: flags.integer({
      char: "p",
      description: "Port number for database server",
    }),
    engine: flags.string({
      char: "e",
      options: ["mssql", "postgres", "mysql", "mariadb", "oracle"],
      description: "Database engine",
    }),
    output: flags.string({
      char: "o",
      description: "Where to place generated models",
    }),
    schema: flags.string({
      char: "s",
      description:
        "Schema name to create model from. Only for mssql and postgres. You can pass multiple values separated by comma eg. -s scheme1,scheme2,scheme3",
    }),
    graphqlFiles: flags.boolean({
      char: "g",
      description:
        "Generate GraphQL API (Description GraphQL files) for entity files",
    }),

    secureResolvers: flags.boolean({
      char: "z",
      description: "Add security to GraphQL API",
    }),

    softDeleteColumn: flags.string({
      char: "w",
      description:
        "Enable soft delete in your entities. Use this flag with the name of entity column, it must be a datetime type column.",
    }),

    ssl: flags.boolean({
      description: "Use ssl connection",
    }),
    noConfig: flags.boolean({
      description: `Doesn't create tsconfig.json and ormconfig.json`,
    }),
    cf: flags.string({
      options: ["pascal", "param", "camel", "none"],
      description: "Convert file names to specified case",
    }),
    ce: flags.string({
      options: ["pascal", "camel", "none"],
      description: "Convert class names to specified case",
    }),
    cp: flags.string({
      options: ["pascal", "camel", "snake", "none"],
      description: "Convert property names to specified case",
    }),
    eol: flags.string({
      options: ["LF", "CRLF"],
      description: "Force EOL to be LF or CRLF",
    }),
    pv: flags.string({
      options: ["public", "protected", "private", "none"],
      description:
        "Defines which visibility should have the generated property",
    }),
    lazy: flags.boolean({
      description: "Generate lazy relations",
    }),
    namingStrategy: flags.string({
      description: "Use custom naming strategy",
    }),
    relationIds: flags.boolean({
      description: "Generate RelationId fields",
    }),
    skipSchema: flags.boolean({
      description: "Omits schema identifier in generated entities",
    }),
    generateConstructor: flags.boolean({
      description: "Generate constructor allowing partial initialization",
    }),
    disablePluralization: flags.boolean({
      description:
        "Disable pluralization of OneToMany, ManyToMany relation names",
    }),
    skipTables: flags.string({
      description:
        "Skip schema generation for specific tables. You can pass multiple values separated by comma",
    }),
    strictMode: flags.string({
      options: ["none", "?", "!"],
      description: "Mark fields as optional(?) or non-null(!)",
    }),
    defaultExport: flags.boolean({
      description: "Generate index file",
    }),
  };

  async run() {
    try {
      this.checks();
      const { flags } = this.parse(DBReverse);

      let options = makeDefaultConfigs();

      const TOMLConfig = readTOMLConfig(options);
      options = TOMLConfig.options;

      if (Object.values(flags).length >= 1) {
        //Check required arguments
        if (!flags.database && !flags.engine) {
          this.error(
            "If you run the generator with arguments you have to specify required arguments: database (-d) and engine (-e)"
          );
          return;
        }
        options = this.checkFlagsParameters(options, flags as IDBReverseFlags);
      } else if (!TOMLConfig.fullConfigFile) {
        options = await useInquirer(options);
      }

      options = validateConfig(options);
      const driver = createDriver(options.connectionOptions.databaseType);
      this.log(
        `[${new Date().toLocaleTimeString()}] Starting creation of model classes.`
      );

      await createModelFromDatabase(
        driver,
        options.connectionOptions,
        options.generationOptions
      );

      this.log(
        `${chalk.cyan.bold(
          `[${new Date().toLocaleTimeString()}] Merlin GQL model classes created.`
        )} ${emoji.rocket}`
      );
    } catch (e) {
      this.error(e);
    }
  }

  checkFlagsParameters(
    options: DBReverseOptions,
    flags: IDBReverseFlags
  ): DBReverseOptions {
    options.connectionOptions.databaseName =
      flags.database ?? options.connectionOptions.databaseName;
    options.connectionOptions.databaseType =
      (flags.engine as DatabaseType) ?? options.connectionOptions.databaseType;

    const driver = createDriver(options.connectionOptions.databaseType);
    const { standardPort, standardSchema, standardUser } = driver;

    options.connectionOptions.host =
      flags.host ?? options.connectionOptions.host;
    options.connectionOptions.password =
      flags.pass ?? options.connectionOptions.password;
    options.connectionOptions.port = flags.port || standardPort;
    options.connectionOptions.schemaName = flags.schema
      ? flags.schema.toString()
      : standardSchema;
    options.connectionOptions.ssl = flags.ssl ?? options.connectionOptions.ssl;
    options.connectionOptions.user = flags.user || standardUser;
    let skipTables = flags.skipTables ? flags.skipTables.split(",") : [];

    if (skipTables.length === 1 && skipTables[0] === "") {
      skipTables = [];
    }

    options.connectionOptions.skipTables = skipTables;
    options.generationOptions.generateConstructor =
      flags.generateConstructor ??
      options.generationOptions.generateConstructor;
    options.generationOptions.convertCaseEntity =
      (flags.ce as IGenerationOptions["convertCaseEntity"]) ??
      options.generationOptions.convertCaseEntity;
    options.generationOptions.convertCaseFile =
      (flags.cf as IGenerationOptions["convertCaseFile"]) ??
      options.generationOptions.convertCaseFile;
    options.generationOptions.convertCaseProperty =
      (flags.cp as IGenerationOptions["convertCaseProperty"]) ??
      options.generationOptions.convertCaseProperty;
    options.generationOptions.convertEol =
      (flags.eol as IGenerationOptions["convertEol"]) ??
      options.generationOptions.convertEol;
    options.generationOptions.lazy =
      flags.lazy ?? options.generationOptions.lazy;
    options.generationOptions.customNamingStrategyPath =
      flags.namingStrategy ??
      options.generationOptions.customNamingStrategyPath;
    options.generationOptions.noConfigs =
      flags.noConfig ?? options.generationOptions.noConfigs;
    options.generationOptions.propertyVisibility =
      (flags.pv as IGenerationOptions["propertyVisibility"]) ??
      options.generationOptions.propertyVisibility;
    options.generationOptions.relationIds =
      flags.relationIds ?? options.generationOptions.relationIds;
    options.generationOptions.skipSchema =
      flags.skipSchema ?? options.generationOptions.skipSchema;
    options.generationOptions.resultsPath =
      flags.output ?? options.generationOptions.resultsPath;
    options.generationOptions.pluralizeNames =
      !flags.disablePluralization ?? options.generationOptions.pluralizeNames;
    options.generationOptions.strictMode =
      (flags.strictMode as IGenerationOptions["strictMode"]) ??
      options.generationOptions.strictMode;
    options.generationOptions.exportType = flags.defaultExport
      ? "default"
      : "named";
    options.generationOptions.graphqlFiles =
      flags.graphqlFiles ?? options.generationOptions.graphqlFiles;
    options.generationOptions.secureResolvers =
      flags.secureResolvers ?? options.generationOptions.secureResolvers;
    options.generationOptions.softDeleteColumn =
      flags.softDeleteColumn ?? undefined;
    return options;
  }
}
