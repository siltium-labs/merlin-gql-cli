import { NewProjectTemplatesEnum, TemplateArgsDictionary } from "./new.config";
import { TypeormDatabaseTypes } from "../commands/new";
export const generateDependencies = (
  template: NewProjectTemplatesEnum,
  templateArgs: TemplateArgsDictionary
): Array<string> => {
  const baseDependencies = [
    "apollo-server",
    "class-validator",
    "cors",
    "express",
    "graphql",
    "merlin-gql",
    "pluralize",
    "reflect-metadata",
    "type-graphql",
    "typeorm",
  ];
  if (template === NewProjectTemplatesEnum.Example) {
    const argDependantDependencies: string[] = [];
    switch (templateArgs["database"] as TypeormDatabaseTypes) {
      case "mssql":
      case "mariadb":
        argDependantDependencies.push("mysql2");
      case "postgres":
        argDependantDependencies.push("pg");
      case "mssql":
        argDependantDependencies.push("mssql");
      case "oracle":
        argDependantDependencies.push("oracledb");
      case "mongodb":
        argDependantDependencies.push("mongodb");
    }
    return [
      ...baseDependencies,
      ...argDependantDependencies,
      "bcryptjs",
      "jsonwebtoken",
      "mysql2",
      "node-fetch",
      "dayjs",
    ];
  } else {
    return baseDependencies;
  }
};

export const generateDevDependencies = (
  template: NewProjectTemplatesEnum,
  templateArgs: TemplateArgsDictionary
): Array<string> => {
  const baseDevDependencies = [
    "concurrently",
    "gulp",
    "gulp-nodemon",
    "gulp-relative-sourcemaps-source",
    "gulp-sourcemaps",
    "gulp-typescript",
    "mocha",
    "nodemon",
    "ts-node",
    "typescript",
  ];
  if (template === NewProjectTemplatesEnum.Example) {
    const argDependantDevDependencies: string[] = [];
    if (templateArgs["ngrok"]) {
      argDependantDevDependencies.push("ngrok");
    }
    return [
      ...baseDevDependencies,
      ...argDependantDevDependencies,
      "@types/bcryptjs",
      "@types/jsonwebtoken",
      "@types/node-fetch",
    ];
  } else {
    return baseDevDependencies;
  }
};
