import { DatabaseType } from './../db-reverse/options/connection-options.interface';
import { Command, flags } from "@oclif/command";
import { userInfo } from "os";
import { getDefaultConnectionOptions } from "../db-reverse/options/connection-options.interface";
import IGenerationOptions, {
  getDefaultGenerationOptions,
} from "../db-reverse/options/generation-options.interface";
import {
  makeDefaultConfigs,
  readTOMLConfig,
  DBReverseoptions,
  useInquirer,
  validateConfig,
} from "../db-reverse";
import {
  createDriver,
  createModelFromDatabase,
} from "../db-reverse/generation/engine";
import { IConnectionOptions } from "../db-reverse/library";
import chalk from 'chalk';
import { emoji } from 'node-emoji';

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
  secureResolvers: boolean;
}

export default class DBReverse extends Command {
  static description = `generate models and graphql resolvers with database reverse engineering.\n
  Usage: merlin-gql db-reverse -h <host> -d <database> -p [port] -u <user> -x [password] -e [engine]\n
  You can also run program without specifying any parameters to launch interactive mode.`;

  static flags = {
    help: flags.help(),
   
    host: flags.string({
      char: "h",
      description: "IP address/Hostname for database server",
      //default: connectionOptions.host,
    }),
    database: flags.string({
      char: "d",      
      description:
        "Database name(or path for sqlite). You can pass multiple values separated by comma.",
      //default: connectionOptions.databaseName,
    }),
    user: flags.string({
      char: "u",
      description: "Username for database server",
      //default: connectionOptions.user,
    }),
    pass: flags.string({
      char: "x",
      description: "Password for database server",
      //default: connectionOptions.password,
    }),
    port: flags.integer({
      char: "p",
      description: "Port number for database server",
      //default: connectionOptions.port,
    }),
    engine: flags.string({
      char: "e",
      options: ["mssql", "postgres", "mysql", "mariadb", "oracle", "sqlite"],
      description: "Database engine",
      //default: connectionOptions.databaseType,
    }),
    output: flags.string({
      char: "o",
      description: "Where to place generated models",
      //default: generationOptions.resultsPath,
    }),
    schema: flags.string({
      char: "s",
      description:
        "Schema name to create model from. Only for mssql and postgres. You can pass multiple values separated by comma eg. -s scheme1,scheme2,scheme3",
      //default: connectionOptions.schemaName,
    }),
    ssl: flags.boolean({
      description: "Use ssl connection",
      //default: connectionOptions.ssl,
    }),
    noConfig: flags.boolean({
      description: `Doesn't create tsconfig.json and ormconfig.json`,
      //default: generationOptions.noConfigs,
    }),
    cf: flags.string({
      options: ["pascal", "param", "camel", "none"],
      description: "Convert file names to specified case",
      //default: generationOptions.convertCaseFile,
    }),
    ce: flags.string({
      options: ["pascal", "camel", "none"],
      description: "Convert class names to specified case",
      //default: generationOptions.convertCaseEntity,
    }),
    cp: flags.string({
      options: ["pascal", "camel", "snake", "none"],
      description: "Convert property names to specified case",
      //default: generationOptions.convertCaseProperty,
    }),
    eol: flags.string({
      options: ["LF", "CRLF"],
      description: "Force EOL to be LF or CRLF",
      //default: generationOptions.convertEol,
    }),
    pv: flags.string({
      options: ["public", "protected", "private", "none"],
      description:
        "Defines which visibility should have the generated property",
      //default: generationOptions.propertyVisibility,
    }),
    lazy: flags.boolean({
      description: "Generate lazy relations",
      //default: generationOptions.lazy,
    }),
    namingStrategy: flags.string({
      description: "Use custom naming strategy",
      //default: generationOptions.customNamingStrategyPath,
    }),
    relationIds: flags.boolean({
      description: "Generate RelationId fields",
      //default: generationOptions.relationIds,
    }),
    skipSchema: flags.boolean({
      description: "Omits schema identifier in generated entities",
      //default: generationOptions.skipSchema,
    }),
    generateConstructor: flags.boolean({
      description: "Generate constructor allowing partial initialization",
      //default: generationOptions.generateConstructor,
    }),
    disablePluralization: flags.boolean({
      description:
        "Disable pluralization of OneToMany, ManyToMany relation names",
      //default: !generationOptions.pluralizeNames,
    }),
    skipTables: flags.string({
      description:
        "Skip schema generation for specific tables. You can pass multiple values separated by comma",
      //default: connectionOptions.skipTables.join(","),
    }),
    strictMode: flags.string({
      options: ["none", "?", "!"],
      description: "Mark fields as optional(?) or non-null(!)",
      //default: generationOptions.strictMode,
    }),
    defaultExport: flags.boolean({
      description: "Generate index file",
      //default: generationOptions.exportType === "default",
    }),
    secureResolvers: flags.boolean({
      description: "Add security to Resolvers with @Secure decorator",
      //default: generationOptions.secureResolvers,
    }),
  };

  async run() {
    const { args, flags } = this.parse(DBReverse);

    let options = makeDefaultConfigs();    

    const TOMLConfig = readTOMLConfig(options);
    options = TOMLConfig.options;   

    if (Object.values(flags).length >= 1) {
      //Check required arguments
      if(!flags.database && !flags.engine){
        this.error("If you run the generator with arguments you have to specify required arguments: database (-d) and engine (-e)");
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
      `${chalk.cyan.bold(`[${new Date().toLocaleTimeString()}] Merlin GQL model classes created.`)} ${emoji.rocket}`
    );    
  }

  checkFlagsParameters(
    options: DBReverseoptions,
    flags: IDBReverseFlags
  ): DBReverseoptions {
    options.connectionOptions.databaseName = flags.database ?? options.connectionOptions.databaseName;
    options.connectionOptions.databaseType = flags.engine as DatabaseType ?? options.connectionOptions.databaseType;

    const driver = createDriver(options.connectionOptions.databaseType);
    const { standardPort, standardSchema, standardUser } = driver;

    options.connectionOptions.host = flags.host ?? options.connectionOptions.host;
    options.connectionOptions.password = flags.pass ?? options.connectionOptions.password;
    options.connectionOptions.port = flags.port || standardPort;
    options.connectionOptions.schemaName = flags.schema
      ? flags.schema.toString()
      : standardSchema;
    options.connectionOptions.ssl = flags.ssl ??  options.connectionOptions.ssl;
    options.connectionOptions.user = flags.user || standardUser;
    let skipTables = flags.skipTables ? flags.skipTables.split(",") : [];

    if (skipTables.length === 1 && skipTables[0] === "") {
      skipTables = [];
    }

    options.connectionOptions.skipTables = skipTables;    
    options.generationOptions.generateConstructor = flags.generateConstructor ?? options.generationOptions.generateConstructor;
    options.generationOptions.convertCaseEntity = flags.ce as IGenerationOptions["convertCaseEntity"] ?? options.generationOptions.convertCaseEntity;
    options.generationOptions.convertCaseFile = flags.cf as IGenerationOptions["convertCaseFile"] ?? options.generationOptions.convertCaseFile;
    options.generationOptions.convertCaseProperty = flags.cp as IGenerationOptions["convertCaseProperty"] ?? options.generationOptions.convertCaseProperty;
    options.generationOptions.convertEol = flags.eol as IGenerationOptions["convertEol"] ?? options.generationOptions.convertEol;
    options.generationOptions.lazy = flags.lazy ?? options.generationOptions.lazy;
    options.generationOptions.customNamingStrategyPath = flags.namingStrategy ?? options.generationOptions.customNamingStrategyPath;
    options.generationOptions.noConfigs = flags.noConfig ?? options.generationOptions.noConfigs;
    options.generationOptions.propertyVisibility = flags.pv as IGenerationOptions["propertyVisibility"] ?? options.generationOptions.propertyVisibility;
    options.generationOptions.relationIds = flags.relationIds ?? options.generationOptions.relationIds;
    options.generationOptions.skipSchema = flags.skipSchema ?? options.generationOptions.skipSchema;
    options.generationOptions.resultsPath = flags.output ?? options.generationOptions.resultsPath;
    options.generationOptions.pluralizeNames = !flags.disablePluralization ?? options.generationOptions.pluralizeNames;
    options.generationOptions.strictMode = flags.strictMode as IGenerationOptions["strictMode"] ?? options.generationOptions.strictMode;
    options.generationOptions.exportType = flags.defaultExport
      ? "default"
      : "named";
    options.generationOptions.secureResolvers = flags.secureResolvers ?? options.generationOptions.secureResolvers;
    return options;
  }
}
