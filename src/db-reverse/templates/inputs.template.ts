import { Column } from "../models/column";
import IGenerationOptions from "../options/generation-options.interface";
import {
  toEntityFileName,
  toEntityName,
  toInputsCreateName,
  toInputsName,
  toInputsUpdateName,
  toPropertyName,
} from "./../generation/model-generation";

const defaultValueIfNeeded = (nullable: boolean, tscType: string) => {
  if (nullable) {
    return "";
  } else if (!nullable && tscType === "string") {
    return ' = ""';
  } else if (!nullable && tscType === "number") {
    return " = 0";
  } else if (!nullable && tscType === "Date") {
    return " = new Date()";
  } else if (!nullable && tscType === "boolean") {
    return " = false";
  }
};

const ColumnTemplate = (
  column: Column,
  generationOptions: IGenerationOptions
) => {
  const fieldNullable = column.options.nullable ? `{ nullable: true }` : "";
  const propertyName = toPropertyName(column.tscName, generationOptions);
  const questionMarkIfNullable = column.options.nullable ? "?" : "";
  const defaultValue = defaultValueIfNeeded(
    !!column.options.nullable,
    column.tscType
  );
  return `
        @Field(${fieldNullable})
        ${propertyName}${questionMarkIfNullable}:${column.tscType}${defaultValue};
        `;
};

const ColumnUpdateTemplate = (
  column: Column,
  generationOptions: IGenerationOptions
) => {
  const fieldNullable = `{ nullable: true }`;
  const propertyName = toPropertyName(column.tscName, generationOptions);
  const questionMarkNullable = "?";  
  return `
        @Field(${fieldNullable})
        ${propertyName}${questionMarkNullable}:${column.tscType};
        `;
};
// prettier-ignore
export const InputsTemplate = (
    tscName: string,
    columns: Column[],
    generationOptions: IGenerationOptions
  ): string => {
      
      const entityName:string = toEntityName(tscName, generationOptions)
      const entityFileName:string = toEntityFileName(tscName, generationOptions)
      const inputsCreateName:string = toInputsCreateName(tscName, generationOptions);
      const inputUpdateName:string = toInputsUpdateName(tscName, generationOptions);

      return `
      
      import {InputType,Field} from "type-graphql";
      import { BaseInputFields } from 'merlin-gql';
      import { ${entityName} } from "./${entityFileName}";
      
      @InputType()
      export class ${inputsCreateName} extends BaseInputFields implements Partial<${entityName}> {
        ${columns.filter(c => !c.generated).map(c => ColumnTemplate(c, generationOptions)).join("\n")}
      }

      @InputType()
      export class ${inputUpdateName} extends BaseInputFields implements Partial<${entityName}> {
        ${columns.filter(c => !c.generated).map(c => ColumnUpdateTemplate(c, generationOptions)).join("\n")}
      }
      `
  }
