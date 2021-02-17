import { NewProjectTemplatesEnum, TemplateArgsDictionary } from "./new.config";
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
    "@merlin-gql/core",
    "pluralize",
    "reflect-metadata",
    "type-graphql",
    "typeorm",
  ];
  const argDependantDependencies: string[] = [];
  if (["mysql", "mariadb"].includes(templateArgs["database"]))
    argDependantDependencies.push("mysql2");
  if (templateArgs["database"] === "postgres")
    argDependantDependencies.push("pg");
  if (templateArgs["database"] === "mssql")
    argDependantDependencies.push("mssql");
  if (templateArgs["database"] === "oracle")
    argDependantDependencies.push("oracledb");
  if (templateArgs["database"] === "mongodb")
    argDependantDependencies.push("mongodb");
  if (template === NewProjectTemplatesEnum.Example) {

    return [
      ...baseDependencies,
      ...argDependantDependencies,
      "bcryptjs",
      "jsonwebtoken",
      "node-fetch",
      "dayjs",
    ];
  } else {
    return [
      ...baseDependencies,
      ...argDependantDependencies
    ];
  }
};

export const generateDevDependencies = (
  template: NewProjectTemplatesEnum,
  templateArgs: TemplateArgsDictionary
): Array<string> => {
  const baseDevDependencies = [
    "gulp",
    "gulp-nodemon",
    "gulp-relative-sourcemaps-source",
    "gulp-sourcemaps",
    "gulp-typescript",
    "mocha",
    "nodemon",
    "ts-node",
    "typescript",
    "open",
    "gulp-cached"
  ];
  const argDependantDevDependencies: string[] = [];
  if (templateArgs["ngrok"]) {
    argDependantDevDependencies.push("ngrok");
  }
  if (template === NewProjectTemplatesEnum.Example) {

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
