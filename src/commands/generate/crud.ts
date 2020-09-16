import { Column } from "./../../db-reverse/models/column";
import { Command, flags } from "@oclif/command";
import {
  createConnection,
  ConnectionOptionsReader,
  EntityMetadata,
  ColumnType,
} from "typeorm";
import { cli } from "cli-ux";
import { Entity } from "../../db-reverse/library";
import { makeDefaultConfigs } from "../../db-reverse";
import { modelGenerationCodeFirst } from "../../db-reverse/generation/model-generation";
import inquirer from 'inquirer';
import chalk from 'chalk';
import { emoji } from 'node-emoji';

export type ModelGenerationOptions = {
  input: boolean,
  filter: boolean
  sort: boolean,
  resolver: boolean
}

export default class GenerateCrud extends Command {  
    static description = `Generate input, filter, sort GraphQL models and GraphQL resolvers from entity models.\n
    Usage: merlin-gql generate:crud -i -f -s -r\n
    You can also run program without specifying any parameters to launch interactive mode.`;

  static examples = [`$ merlin-gql generate:crud`];

  static flags = {         
      help: flags.help(),    
      input: flags.boolean({
        char: "i",        
        description: "Generate input GraphQL model from entity model",        
      }),
      filter: flags.boolean({
        char: "f",        
        description: "Generate filter GraphQL model from entity model",        
      }),
      sort: flags.boolean({
        char: "s",
        description: "Generate sort GraphQL model from entity model",        
      }),
      resolver: flags.boolean({
        char: "r",
        description: "Generate GraphQL resolver from entity model",        
      }),   
  }

  static args = [
  ];

  async run() {
    const { args, flags } = this.parse(GenerateCrud);
    
    if(!flags.input && !flags.filter && !flags.sort && !flags.resolver){
      const options:{options:string[]} = await inquirer.prompt([
        {
          name: "options",
          message: `Select wich files types do you want to generate`,
          type: "checkbox",
          choices: [
            "inputs",
            "filters",
            "sorts",
            "resolvers"            
          ],
        },
      ]);
      
      for(const option of options.options){
        switch(option){
          case "inputs":{
            flags.input = true;
            break;
          }
          case "filters":{
            flags.filter = true;
            break;
          }
          case "sorts":{
            flags.sort = true;
            break;
          }
          case "resolvers":{
            flags.resolver = true;
            break;
          }
        } 
      }      
    }
    
    let entities = await gatherModelsInfo();    
    let configOptions = makeDefaultConfigs();

    modelGenerationCodeFirst(configOptions.generationOptions, entities, flags);
    this.log(
      `${chalk.cyan.bold("Files generated succesfully")} ${emoji.rocket}`
    );
  }
}

const gatherModelsInfo = async () => {
  const connectionOptionsReader = new ConnectionOptionsReader({
    root: process.cwd(),
    configName: "ormconfig",
  });

  const connectionOptions = {
    ...(await connectionOptionsReader.get("default")),
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    logging: false,
  };

  //const connection = await createConnection(connectionOptions);
  //const entities = connection.entityMetadatas.map((m) => ({
  //   name: m.name,
  //   relations: `[${m.relations.map((r) => (r.type as any).name).join(", ")}]`,
  // }));

  const connection = await createConnection(connectionOptions);
  const entitiesMetadata = connection.entityMetadatas;
  const entities = generateModelEntities(entitiesMetadata);
  return entities;
};

const generateModelEntities = async (entityMetadata: EntityMetadata[]) => {
  const entities: Entity[] = [];
  for (const metadata of entityMetadata) {
    let entity: Entity = {
      sqlName: metadata.tableName,
      tscName: metadata.name,
      relationIds: [],
      relations: [],
      fileImports: [],
      indices: [],
      columns: await generateEntityColumns(metadata),
    };
    entities.push(entity);
  }
  return entities;
};

const generateEntityColumns = async (entityMetadata: EntityMetadata) => {
  const columns: Column[] = [];
  entityMetadata.columns.forEach((columnMetadata) => {
    const column: Column = {
      tscName: columnMetadata.propertyName,
      tscType: getColumnTscType(columnMetadata.type),
      type: columnMetadata.type,
      primary: columnMetadata.isPrimary,
      options: {
        name: columnMetadata.databaseName,
        nullable: columnMetadata.isNullable,
      },
    };
    columns.push(column);
  });

  return columns;
};

const getColumnTscType = (columnType: ColumnType) => {
  switch (columnType) {      
    case ("character varying"): 
    case ( "varying character"):  
    case ( "char varying" ): 
    case ( "nvarchar"): 
    case ( "national varchar"): 
    case ( "character"): 
    case ( "native character"): 
    case ( "varchar"): 
    case ( "char"): 
    case ( "nchar"): 
    case ( "national char"): 
    case ( "varchar2"): 
    case ( "nvarchar2"): 
    case ( "alphanum"): 
    case ( "shorttext"): 
    case ( "raw"): 
    case ( "binary"): 
    case ( "varbinary"): 
    case ( "tinytext"): 
    case ( "mediumtext"): 
    case ( "text"): 
    case ( "ntext"): 
    case ( "citext"): 
    case ( "longtext"): 
    case ( "alphanum"): 
    case ( "shorttext"): 
    case ( "uuid"): 
    case ( "string"): {
      return "string";
    }
    case("float"): 
    case ( "double"): 
    case ( "dec"): 
    case ( "decimal"): 
    case ( "smalldecimal"): 
    case ( "fixed"): 
    case ( "numeric"): 
    case ( "real"): 
    case ( "double precision"): 
    case ( "number"): 
    case ( "tinyint"): 
    case ( "smallint"): 
    case ( "mediumint"): 
    case ( "int"): 
    case ( "bigint"): 
    case ( "int2"): 
    case ( "integer"): 
    case ( "int4"): 
    case ( "int8"): 
    case ( "int64"): 
    case ( "unsigned big int"): 
    case ( "float"): 
    case ( "float4"): 
    case ( "float8"): 
    case ( "smallmoney"): 
    case ( "money"): 
    case ( "long"): 
    {
      return "number";
    }
    case("datetime"): 
    case ( "datetime2"): 
    case ( "datetimeoffset"): 
    case ( "time"): 
    case ( "time with time zone"): 
    case ( "time without time zone"): 
    case ( "timestamp"): 
    case ( "timestamp without time zone"): 
    case ( "timestamp with time zone"): 
    case ( "timestamp with local time zone"): 
    case ( "timetz"): 
    case ( "timestamptz"): 
    case ( "timestamp with local time zone"): 
    case ( "smalldatetime"): 
    case ( "date"): 
    case ( "interval year to month"): 
    case ( "interval day to second"): 
    case ( "interval"):{
      return "Date";
    }
    case("boolean"): 
    case ( "bool"):{
      return "boolean";
    }   
    default: {
      return "string";
    }
  }
};