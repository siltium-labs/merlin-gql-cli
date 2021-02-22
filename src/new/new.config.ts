import { TypeormDatabaseTypes } from "../commands/new";
import { OrmConfigTemplateParams } from "./new";

export enum NewProjectTemplatesEnum {
  Basic = "basic",
  Example = "example",
}

export type TemplateArgsDictionary = {
  database: TypeormDatabaseTypes,
  [key: string]: any
};

export type NewProjectConfig = {
  name: string;
  template: NewProjectTemplatesEnum;
  templateArgs: TemplateArgsDictionary;
  ormConfigParams: OrmConfigTemplateParams;
  jwtSecret?: string;
};
