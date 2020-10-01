import { JoinColumnOptions } from "typeorm";
import { Index } from "../models";
import { Column } from "../models/column";
import { Relation } from "../models/relation";
import IGenerationOptions from "../options/generation-options.interface";
import {
  defaultExport,
  printPropertyVisibility,
  strictMode,
  toEntityDirectoryName,
  toEntityFileName,
  toEntityName,
  toFileName,
  toFiltersName,
  toGraphQLFilterRelation,
  toGraphQLFilterRelationType,
  toJson,
  toLocalImport,
  toPropertyName,
  toRelation,
} from "./../generation/model-generation";
import { Entity } from "./../models/entity";

const defaultFilterType = (tscType: string) => {
  if (tscType === "string") {
    return "FilteredString";
  } else if (tscType === "number") {
    return "FilteredFloat";
  } else if (tscType === "Date") {
    return "FilteredDate";
  } else if (tscType === "boolean") {
    return "FilteredBoolean";
  }
};

// prettier-ignore
const ImportsTemplate = (fileImport: string, generationOptions: IGenerationOptions) => {    
    return `
    import ${toLocalImport(toFiltersName(fileImport, generationOptions), generationOptions)} from "../${toEntityDirectoryName(fileImport, generationOptions)}/${toFileName(fileImport, generationOptions)}.filter";
    `;
};

// prettier-ignore
const ColumnTemplate = (  
  column: Column,
  generationOptions: IGenerationOptions
) => {  
  const propertyName = toPropertyName(column.tscName, generationOptions);  
  const defaultValue = defaultFilterType(column.tscType);  
  const graphqlDecorator = column.generated ? 
    `@Field((type)=> FilteredID, {nullable: true})` : 
    `@Field((type)=> ${defaultValue}, { nullable: true })`;

  return `
    ${graphqlDecorator}    
    ${propertyName}?:${column.tscType};
  `;
};

// prettier-ignore
const RelationTemplate = (  
  relation: Relation,
  generationOptions: IGenerationOptions
  ) => {
    //@Field((type) => {{toGraphQLFilterRelation (toEntityName relatedTable) relationType}}, { nullable: true })
   //{{printPropertyVisibility}}{{toPropertyName fieldName}}?:{{toGraphQLFilterRelationType (toEntityName relatedTable) relationType}};
    const relatedTableEntityName = toEntityName(relation.relatedTable, generationOptions);    
    const propertyName = `${toPropertyName(relation.fieldName, generationOptions)}?:${toGraphQLFilterRelationType(relatedTableEntityName, relation.relationType)};`
    return `
    @Field((type) =>  ${toGraphQLFilterRelation(relatedTableEntityName, relation.relationType)}, { nullable: true })    
    ${propertyName}
    `;
  };

// prettier-ignore
export const Filteremplate = (    
    entity: Entity,
    generationOptions: IGenerationOptions
): string => {     
  
  const filterName:string = toFiltersName(entity.tscName, generationOptions);    ;
    
  return `
        import {InputType,Field} from "type-graphql";
        import { BaseFilterFields, FilteredID, FilteredInt, FilteredFloat, FilteredBoolean, FilteredDate, FilteredString } from "merlin-gql";
        ${entity.fileImports.map(fileImport => ImportsTemplate(fileImport,generationOptions)).join("\n")}
        
        @InputType()
        export ${defaultExport(generationOptions)} class ${filterName} extends BaseFilterFields {
        
          @Field((type) => [{{toFiltersName tscName}}], { nullable: true })
          or?: {{toFiltersName tscName}}[];

          @Field((type) => [{{toFiltersName tscName}}], { nullable: true })
          and?: {{toFiltersName tscName}}[];

          ${entity.columns.map(c => ColumnTemplate(c, generationOptions)).join("\n")}
          
          ${entity.relations.map(r => RelationTemplate(r, generationOptions)).join("\n")}         
        }
      `
  }
