import { Column } from "./../../db-reverse/models/column";
import { Command } from "@oclif/command";
import {
  createConnection,
  ConnectionOptionsReader,
  EntityMetadata,
  ColumnType,
} from "typeorm";
import { cli } from "cli-ux";
import { Entity } from "../../db-reverse/library";
import { makeDefaultConfigs } from "../../db-reverse";
import modelCustomizationPhase from "../../db-reverse/generation/model-customization";
import { modelGenerationCodeFirst } from "../../db-reverse/generation/model-generation";

export default class EntitiesList extends Command {
  static aliases = ["l"];
  static description = "Lists all typeorm existing entities";

  static examples = [`$ merlin-gql list:entities`];

  static flags = {};

  static args = [];

  async run() {
    cli.action.start("Reading metadata...");
    let entities = await gatherModelsInfo();

    // entities = modelCustomizationPhase(
    //   entities,
    //   options.generationOptions,
    //   driver.defaultValues
    // );
    let options = makeDefaultConfigs();
    modelGenerationCodeFirst(options.generationOptions, entities);
    cli.action.stop();

    cli.table(entities, {
      name: { minWidth: 10 },
      //relations: { minWidth: 10 },
    });
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