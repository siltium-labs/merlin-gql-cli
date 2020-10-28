import "reflect-metadata";
import { buildSchema } from "type-graphql";
import fs from "fs";
import path from "path";
import * as glob from "glob";

export type MerlinGQLConfig = {
  ots: string[];
};

export const getMerlinGqlConfigResolversPath = (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    try {
      const merlinGqlJsonFilePath = path.join(
        process.cwd(),
        "merlin-gql-config.json"
      );
      const fileExists = fs.existsSync(merlinGqlJsonFilePath);
      if (!fileExists) {
        throw new Error("There is no merlin-gql.json file, please create it.");
      }
      const merlinGqlJsonFileContent = fs.readFileSync(
        merlinGqlJsonFilePath,
        "utf-8"
      );
      const merlinGqlConfig = JSON.parse(
        merlinGqlJsonFileContent
      ) as MerlinGQLConfig;
      if (!merlinGqlConfig.ots || merlinGqlConfig.ots.length === 0) {
        throw new Error(
          "There must be at least one ot expression in the merlin-gql-config.json file"
        );
      }
      return resolve([...merlinGqlConfig.ots]);
    } catch (e) {
      return reject(e);
    }
  });

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadOtsFromGlob(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  const modules = filePaths.map((fileName) => {
    //console.log(fileName);
    const x = require(fileName);
  });
}

export const loadOtFiles = async () => {
  try {
    const resolversRelativePaths = [
      ...(await getMerlinGqlConfigResolversPath()).map(
        (p) => `${process.cwd()}/dist/${p}`
      ),
    ];
    //console.log(resolversRelativePaths);

    resolversRelativePaths.map((r) => {
      loadOtsFromGlob(r);
    });
  } catch (e) {
    throw e;
  }
};

export const generateGraphqlSchema = async () => {
  try {
    const resolversRelativePaths = (
      await getMerlinGqlConfigResolversPath()
    ).map((p) => `${process.cwd()}/dist/${p}`);
    //console.log(resolversRelativePaths);

    const schema = await buildSchema({
      resolvers: resolversRelativePaths as any,
    });
    return schema;
  } catch (e) {
    console.log(e);
    throw new Error(
      "Error when reading the path for resolvers, please check your merlin-gql.json file"
    );
  }
};
