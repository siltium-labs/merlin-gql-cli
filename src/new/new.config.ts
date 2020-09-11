import { OrmConfigTemplateParams } from "./new";

export enum NewProjectTemplatesEnum {
  Basic = "basic",
  Example = "example",
}

export type TemplateArgsDictionary = { [key: string]: any };

export type NewProjectConfig = {
  name: string;
  template: NewProjectTemplatesEnum;
  templateArgs: TemplateArgsDictionary;
  ormConfigParams: OrmConfigTemplateParams;
  jwtSecret?: string;
};
