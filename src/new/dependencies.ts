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
    "merlin-gql",
    "pluralize",
    "reflect-metadata",
    "type-graphql",
    "typeorm",
  ];
  if (template === NewProjectTemplatesEnum.Example) {
    const argDependantDependencies: string[] = [];

    return [
      ...baseDependencies,
      ...argDependantDependencies,
      "bcryptjs",
      "jsonwebtoken",
      "mysql2",
      "node-fetch",
      "moment",
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
