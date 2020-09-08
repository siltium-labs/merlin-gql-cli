import { EOL } from "os";
import path = require("path");

export default interface IGenerationOptions {
  resultsPath: string;
  pluralizeNames: boolean;
  noConfigs: boolean;
  convertCaseFile: "pascal" | "param" | "camel" | "none";
  convertCaseEntity: "pascal" | "camel" | "none";
  convertCaseProperty: "pascal" | "camel" | "snake" | "none";
  convertEol: "LF" | "CRLF";
  propertyVisibility: "public" | "protected" | "private" | "none";
  lazy: boolean;
  generateConstructor: boolean;
  customNamingStrategyPath: string;
  relationIds: boolean;
  strictMode: "none" | "?" | "!";
  skipSchema: boolean;
  exportType: "named" | "default";
  secureResolvers: boolean;
}

export const eolConverter = {
  LF: "\n",
  CRLF: "\r\n",
};

export function getDefaultGenerationOptions(): IGenerationOptions {
  const generationOptions: IGenerationOptions = {
    resultsPath: path.resolve(process.cwd(), "output"),
    pluralizeNames: true,
    noConfigs: true,
    convertCaseFile: "param",
    convertCaseEntity: "pascal",
    convertCaseProperty: "camel",
    convertEol: EOL === "\n" ? "LF" : "CRLF",
    propertyVisibility: "none",
    lazy: true,
    generateConstructor: false,
    customNamingStrategyPath: "",
    relationIds: false,
    strictMode: "none",
    skipSchema: false,
    exportType: "named",
    secureResolvers: false,
  };
  return generationOptions;
}
