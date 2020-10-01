import "reflect-metadata";
import { buildSchema } from "type-graphql";
import fs from "fs";
import path from "path";
import * as glob from "glob";

export type MerlinGQLConfig = {
  resolvers: string[];
};

export const getMerlinGqlConfigResolversPath = (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    try {
      const merlinGqlJsonFilePath = path.join(
        process.cwd(),
        "merlin-gql-config.json"
      );

      const merlinGqlJsonFileContent = fs.readFileSync(
        merlinGqlJsonFilePath,
        "utf-8"
      );
      const merlinGqlConfig = JSON.parse(
        merlinGqlJsonFileContent
      ) as MerlinGQLConfig;
      return resolve(merlinGqlConfig.resolvers);
    } catch (e) {
      return reject(e);
    }
  });

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadResolversFromGlob(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  const modules = filePaths.map((fileName) => {
    //console.log(fileName);
    const x = require(fileName);
  });
}

export const loadResolverFiles = async () => {
  try {
    const resolversRelativePaths = (
      await getMerlinGqlConfigResolversPath()
    ).map((p) => `${process.cwd()}/dist/${p}`);
    //console.log(resolversRelativePaths);

    resolversRelativePaths.map((r) => {
      loadResolversFromGlob(r);
    });
  } catch (e) {
    console.log(e);
    throw new Error(
      "Error when reading the path for resolvers, please check your merlin-gql.json file"
    );
  }
};
