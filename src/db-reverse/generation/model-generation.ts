import * as Handlebars from "handlebars";
import * as Prettier from "prettier";
import * as changeCase from "change-case";
import * as fs from "fs";
import * as path from "path";
import { EOL } from "os";
import IConnectionOptions from "../options/connection-options.interface";
import IGenerationOptions, {
  eolConverter,
} from "../options/generation-options.interface";
import { Entity } from "../models/entity";
import { Relation } from "../models/relation";
import { singular } from "pluralize";
import { ModelGenerationOptions } from '../../commands/generate/crud';

const prettierOptions: Prettier.Options = {
  parser: "typescript",
  endOfLine: "auto",
  tabWidth: 4,
  printWidth: 200,
};

export default function modelGenerationPhase(
  connectionOptions: IConnectionOptions,
  generationOptions: IGenerationOptions,
  databaseModel: Entity[]
): void {
  createHandlebarsHelpers(generationOptions);

  const resultPath = generationOptions.resultsPath;

  if (!fs.existsSync(resultPath)) {
    fs.mkdirSync(resultPath);
  }

  let entitiesPath = resultPath;

  if (!generationOptions.noConfigs) {
    entitiesPath = path.resolve(resultPath, "./entities");
    if (!fs.existsSync(entitiesPath)) {
      fs.mkdirSync(entitiesPath);
    }
  }

  generateFiles(databaseModel, generationOptions, entitiesPath);
}

export function modelGenerationCodeFirst(
  generationOptions: IGenerationOptions,
  databaseModel: Entity[],
  flags: ModelGenerationOptions
) {
  createHandlebarsHelpers(generationOptions);
  const resultPath = generationOptions.resultsPath;
  if (!fs.existsSync(resultPath)) {
    fs.mkdirSync(resultPath);
  }
  let entitiesPath = resultPath;
  if (!generationOptions.noConfigs) {
    entitiesPath = path.resolve(resultPath, "./entities");
    if (!fs.existsSync(entitiesPath)) {
      fs.mkdirSync(entitiesPath);
    }
  }
  generateGraphQLFiles(databaseModel, generationOptions, entitiesPath, flags);
}

function generateFiles(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  entitiesPath: string  
) {
  const entityTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "entity.handlebars"
  );
  const filtersTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "filters.handlebars"
  );
  const sortsTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "sorts.handlebars"
  );
  const inputsTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "inputs.handlebars"
  );
  const resolverTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "resolver.handlebars"
  );

  const entityTemplate = fs.readFileSync(entityTemplatePath, "utf-8");
  const entityCompliedTemplate = Handlebars.compile(entityTemplate, {
    noEscape: true,
  });

  const filtersTemplate = fs.readFileSync(filtersTemplatePath, "utf-8");
  const filtersCompliedTemplate = Handlebars.compile(filtersTemplate, {
    noEscape: true,
  });

  const sortsTemplate = fs.readFileSync(sortsTemplatePath, "utf-8");
  const sortsCompliedTemplate = Handlebars.compile(sortsTemplate, {
    noEscape: true,
  });

  const inputsTemplate = fs.readFileSync(inputsTemplatePath, "utf-8");
  const inputsCompliedTemplate = Handlebars.compile(inputsTemplate, {
    noEscape: true,
  });

  const resolverTemplate = fs.readFileSync(resolverTemplatePath, "utf-8");
  const resolverCompliedTemplate = Handlebars.compile(resolverTemplate, {
    noEscape: true,
  });

  databaseModel.forEach((element) => {
    let casedFileName = "";
    switch (generationOptions.convertCaseFile) {
      case "camel":
        casedFileName = changeCase.camelCase(element.tscName);
        break;
      case "param":
        casedFileName = changeCase.paramCase(element.tscName);
        break;
      case "pascal":
        casedFileName = changeCase.pascalCase(element.tscName);
        break;
      case "none":
        casedFileName = element.tscName;
        break;
      default:
        throw new Error("Unknown case style 1");
    }

    element.tscName = singular(element.tscName);
    let baseFileName = singular(casedFileName);
    let filesPathModels = path.join(entitiesPath, "models", baseFileName);
    let filesPathResolvers = path.join(entitiesPath, "resolvers");

    fs.mkdirSync(filesPathModels, { recursive: true });
    fs.mkdirSync(filesPathResolvers, { recursive: true });

    generateEntity(
      databaseModel,
      generationOptions,
      baseFileName,
      filesPathModels,
      entityCompliedTemplate,
      element
    );
    generateFilters(
      databaseModel,
      generationOptions,
      baseFileName,
      filesPathModels,
      filtersCompliedTemplate,
      element
    );
    generateSort(
      databaseModel,
      generationOptions,
      baseFileName,
      filesPathModels,
      sortsCompliedTemplate,
      element
    );
    generateInput(
      databaseModel,
      generationOptions,
      baseFileName,
      filesPathModels,
      inputsCompliedTemplate,
      element
    );
    generateResolver(
      databaseModel,
      generationOptions,
      baseFileName,
      filesPathResolvers,
      resolverCompliedTemplate,
      element
    );
  });
}

function generateGraphQLFiles(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  entitiesPath: string,
  flags: ModelGenerationOptions
) { 
  const filtersTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "filters.handlebars"
  );
  const sortsTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "sorts.handlebars"
  );
  const inputsTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "inputs.handlebars"
  );
  const resolverTemplatePath = path.resolve(
    __dirname,
    "../templates",
    "resolver.handlebars"
  );  

  const filtersTemplate = fs.readFileSync(filtersTemplatePath, "utf-8");
  const filtersCompliedTemplate = Handlebars.compile(filtersTemplate, {
    noEscape: true,
  });

  const sortsTemplate = fs.readFileSync(sortsTemplatePath, "utf-8");
  const sortsCompliedTemplate = Handlebars.compile(sortsTemplate, {
    noEscape: true,
  });

  const inputsTemplate = fs.readFileSync(inputsTemplatePath, "utf-8");
  const inputsCompliedTemplate = Handlebars.compile(inputsTemplate, {
    noEscape: true,
  });

  const resolverTemplate = fs.readFileSync(resolverTemplatePath, "utf-8");
  const resolverCompliedTemplate = Handlebars.compile(resolverTemplate, {
    noEscape: true,
  });

  databaseModel.forEach((element) => {
    let casedFileName = "";
    switch (generationOptions.convertCaseFile) {
      case "camel":
        casedFileName = changeCase.camelCase(element.tscName);
        break;
      case "param":
        casedFileName = changeCase.paramCase(element.tscName);
        break;
      case "pascal":
        casedFileName = changeCase.pascalCase(element.tscName);
        break;
      case "none":
        casedFileName = element.tscName;
        break;
      default:
        throw new Error("Unknown case style 1");
    }

    element.tscName = singular(element.tscName);
    let baseFileName = singular(casedFileName);
    let filesPathModels = path.join(entitiesPath, "models", baseFileName);
    let filesPathResolvers = path.join(entitiesPath, "resolvers");

    fs.mkdirSync(filesPathModels, { recursive: true });
    fs.mkdirSync(filesPathResolvers, { recursive: true });
     
    if(flags.filter){
      generateFilters(
        databaseModel,
        generationOptions,
        baseFileName,
        filesPathModels,
        filtersCompliedTemplate,
        element
      );
    }
    
    if(flags.sort){
      generateSort(
        databaseModel,
        generationOptions,
        baseFileName,
        filesPathModels,
        sortsCompliedTemplate,
        element
      );
    }

    if(flags.input){
      generateInput(
        databaseModel,
        generationOptions,
        baseFileName,
        filesPathModels,
        inputsCompliedTemplate,
        element
      );
    }

    if(flags.resolver){
      generateResolver(
        databaseModel,
        generationOptions,
        baseFileName,
        filesPathResolvers,
        resolverCompliedTemplate,
        element
      );
    }   
  });
}

function generateEntity(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  baseFileName: string,
  filesPath: string,
  entityCompliedTemplate: HandlebarsTemplateDelegate<any>,
  element: Entity
) {
  const filePath = path.resolve(filesPath, `${baseFileName}.model.ts`);
  const rendered = entityCompliedTemplate(element);
  writeFile(rendered, generationOptions, element, filePath);
}

function generateFilters(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  baseFileName: string,
  filesPath: string,
  filtersCompliedTemplate: HandlebarsTemplateDelegate<any>,
  element: Entity
) {
  const filePath = path.resolve(filesPath, `${baseFileName}-filters.model.ts`);
  const rendered = filtersCompliedTemplate(element);
  writeFile(rendered, generationOptions, element, filePath);
}

function generateSort(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  baseFileName: string,
  filesPath: string,
  sortCompliedTemplate: HandlebarsTemplateDelegate<any>,
  element: Entity
) {
  const filePath = path.resolve(filesPath, `${baseFileName}-sorts.model.ts`);
  const rendered = sortCompliedTemplate(element);
  writeFile(rendered, generationOptions, element, filePath);
}

function generateInput(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  baseFileName: string,
  filesPath: string,
  inputCompliedTemplate: HandlebarsTemplateDelegate<any>,
  element: Entity
) {
  const filePath = path.resolve(filesPath, `${baseFileName}-inputs.model.ts`);
  const rendered = inputCompliedTemplate(element);
  writeFile(rendered, generationOptions, element, filePath);
}

function generateResolver(
  databaseModel: Entity[],
  generationOptions: IGenerationOptions,
  baseFileName: string,
  filesPath: string,
  inputCompliedTemplate: HandlebarsTemplateDelegate<any>,
  element: Entity
) {
  const filePath = path.resolve(filesPath, `${baseFileName}.resolver.ts`);
  const rendered = inputCompliedTemplate({
    ...element,
    secureResolvers: generationOptions.secureResolvers,
  });
  writeFile(rendered, generationOptions, element, filePath);
}

function writeFile(
  rendered: any,
  generationOptions: IGenerationOptions,
  element: Entity,
  filePath: string
) {
  const withImportStatements = removeUnusedImports(
    EOL !== eolConverter[generationOptions.convertEol]
      ? rendered.replace(
          /(\r\n|\n|\r)/gm,
          eolConverter[generationOptions.convertEol]
        )
      : rendered
  );
  let formatted = "";
  try {
    formatted = Prettier.format(withImportStatements, prettierOptions);
  } catch (error) {
    console.error(
      "There were some problems with model generation for table: ",
      element.sqlName
    );
    console.error(error);
    formatted = withImportStatements;
  }
  fs.writeFileSync(filePath, formatted, {
    encoding: "utf-8",
    flag: "w",
  });
}

function removeUnusedImports(rendered: string) {
  const openBracketIndex = rendered.indexOf("{") + 1;
  const closeBracketIndex = rendered.indexOf("}");
  const imports = rendered
    .substring(openBracketIndex, closeBracketIndex)
    .split(",");
  const restOfEntityDefinition = rendered.substring(closeBracketIndex);

  const distinctImports = imports.filter(
    (v) =>
      restOfEntityDefinition.indexOf(`@${v}(`) !== -1 ||
      (v === "BaseEntity" && restOfEntityDefinition.indexOf(v) !== -1) ||
      (v === "InputType" && restOfEntityDefinition.indexOf(v) !== -1)
  );

  return `${rendered.substring(0, openBracketIndex)}${distinctImports.join(
    ","
  )}${restOfEntityDefinition}`;
}

function createHandlebarsHelpers(generationOptions: IGenerationOptions): void {
  Handlebars.registerHelper("json", (context) => {
    const json = JSON.stringify(context);
    const withoutQuotes = json.replace(/"([^(")"]+)":/g, "$1:");
    return withoutQuotes.slice(1, withoutQuotes.length - 1);
  });

  Handlebars.registerHelper("toEntityName", (str) => {
    return singular(getEntityName(generationOptions.convertCaseEntity, str));
  });

  Handlebars.registerHelper("toInputsName", (str) => {
    return getEntityName(generationOptions.convertCaseEntity, str) + "Inputs";
  });

  Handlebars.registerHelper("toFiltersName", (str) => {
    return getEntityName(generationOptions.convertCaseEntity, str) + "Filters";
  });

  Handlebars.registerHelper("toSortsName", (str) => {
    return getEntityName(generationOptions.convertCaseEntity, str) + "Sorts";
  });

  Handlebars.registerHelper("toResolverName", (str) => {
    return getEntityName(generationOptions.convertCaseEntity, str) + "Resolver";
  });

  Handlebars.registerHelper("toFileName", (str) => {
    return singular(getEntityName(generationOptions.convertCaseFile, str));
  });

  Handlebars.registerHelper("toEntityDirectoryName", (str) => {
    return singular(getEntityName(generationOptions.convertCaseFile, str));
  });

  Handlebars.registerHelper("toEntityFileName", (str) => {
    return (
      singular(getEntityName(generationOptions.convertCaseFile, str)) + ".model"
    );
  });

  Handlebars.registerHelper("toPropertyName", (str) => {
    return getEntityName(generationOptions.convertCaseProperty, str);
  });

  Handlebars.registerHelper("printPropertyVisibility", () =>
    generationOptions.propertyVisibility !== "none"
      ? `${generationOptions.propertyVisibility} `
      : ""
  );

  Handlebars.registerHelper(
    "toRelation",
    (entityType: string, relationType: Relation["relationType"]) => {
      let retVal = entityType;
      if (relationType === "ManyToMany" || relationType === "OneToMany") {
        retVal = `${retVal}[]`;
      }
      if (generationOptions.lazy) {
        retVal = `Promise<${retVal}>`;
      }
      return retVal;
    }
  );

  Handlebars.registerHelper(
    "toGraphQLSortRelation",
    (entityType: string, relationType: Relation["relationType"]) => {
      let retVal = entityType;
      if (relationType === "ManyToMany" || relationType === "OneToMany") {
        retVal = `[${retVal}Sorts]`;
      }     
      else{
        retVal = `${retVal}Sorts`;
      } 
      return retVal;
    }
  );

  Handlebars.registerHelper(
    "toGraphQLRelation",
    (entityType: string, relationType: Relation["relationType"]) => {
      let retVal = entityType;
      if (relationType === "ManyToMany" || relationType === "OneToMany") {
        retVal = `[${retVal}Filters]`;
      }  
      else{
        retVal = `${retVal}Filters`;
      }     
      return retVal;
    }
  );
  Handlebars.registerHelper("defaultExport", () =>
    generationOptions.exportType === "default" ? "default" : ""
  );
  Handlebars.registerHelper("localImport", (entityName: string) =>
    generationOptions.exportType === "default" ? entityName : `{${entityName}}`
  );
  Handlebars.registerHelper("strictMode", () =>
    generationOptions.strictMode !== "none" ? generationOptions.strictMode : ""
  );
  Handlebars.registerHelper({
    and: (v1, v2) => v1 && v2,
    eq: (v1, v2) => v1 === v2,
    gt: (v1, v2) => v1 > v2,
    gte: (v1, v2) => v1 >= v2,
    lt: (v1, v2) => v1 < v2,
    lte: (v1, v2) => v1 <= v2,
    ne: (v1, v2) => v1 !== v2,
    or: (v1, v2) => v1 || v2,
  });
}

function getEntityName(convertCase: string, str: string) {
  let retStr = "";
  switch (convertCase) {
    case "camel":
      retStr = changeCase.camelCase(str);
      break;
    case "param":
      retStr = changeCase.paramCase(str);
      break;
    case "pascal":
      retStr = changeCase.pascalCase(str);
      break;
    case "snake":
      retStr = changeCase.snakeCase(str);
      break;
    case "none":
      retStr = str;
      break;
    default:
      throw new Error("Unknown case style 2");
  }
  return retStr;
}
