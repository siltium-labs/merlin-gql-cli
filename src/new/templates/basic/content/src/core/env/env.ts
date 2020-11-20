import { first } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { LoggerOptions } from "typeorm/logger/LoggerOptions";
import * as fs from "fs";

export const isProduction = process.env.NODE_ENV === "prod";

export interface IEnvironmentalConfig {
  secretToken: string;
  enablePlayground: boolean;
}

export const getCurrentEnvironmentalConfig = (): Promise<
  IEnvironmentalConfig
> => readConfig();

export const readConfig = (): Promise<IEnvironmentalConfig> => {
  return new Promise((resolve, reject) => {
    fs.readFile(getConfigFilePath(), "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

export const getConfigFilePath = () => {
  const sufix = isProduction ? "" : ".development";
  return `${__dirname}/../../../config${sufix}.json`;
};

export const isDevelopment =
  process.env.NODE_ENV !== "prod" && process.env.NODE_ENV !== "test";
