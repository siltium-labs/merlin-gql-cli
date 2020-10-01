import { Column } from "../models/column";
import { Relation } from "../models/relation";
import IGenerationOptions from "../options/generation-options.interface";
import {
  defaultExport,
  toEntityDirectoryName,
  toFileName,
  toGraphQLSortRelation,
  toLocalImport,
  toPropertyName,
  toRelation,
  toSortsName,
} from "./../generation/model-generation";
import { Entity } from "./../models/entity";

// prettier-ignore
const ImportsTemplate = (fileImport: string, generationOptions: IGenerationOptions) => {    
    return `
    import ${toLocalImport(toSortsName(fileImport, generationOptions), generationOptions)} from "../${toEntityDirectoryName(fileImport, generationOptions)}/${toFileName(fileImport, generationOptions)}.sort";
    `;
};

// prettier-ignore
const ColumnTemplate = ( 
  column: Column,
  generationOptions: IGenerationOptions
) => {  
  const propertyName = toPropertyName(column.tscName, generationOptions);  
  return `
    @Field((type) => SortField, { nullable: true })
    ${propertyName}?:SortField;
  `;
};

// prettier-ignore
const RelationTemplate = (  
  relation: Relation,
  generationOptions: IGenerationOptions
  ) => {     
    const relatedTableEntityName = toSortsName(relation.relatedTable, generationOptions);
    const propertyName = `${toSortsName(relation.fieldName, generationOptions)}?:${toRelation(relatedTableEntityName, relation.relationType, generationOptions)};`
    return `
    @Field((type) => ${toGraphQLSortRelation(relatedTableEntityName, relation.relationType)}, { nullable: true })
    ${propertyName}
    `;
  };

// prettier-ignore
export const SortTemplate = (    
    entity: Entity,
    generationOptions: IGenerationOptions
): string => {       
  const sortsName:string = toSortsName(entity.tscName, generationOptions);      
  return `
        import {InputType, Field} from "type-graphql";
        import { BaseSortFields, SortField } from "merlin-gql";
        ${entity.fileImports.map(fileImport => ImportsTemplate(fileImport,generationOptions)).join("\n")}

        @InputType()
        export ${defaultExport(generationOptions)} class ${sortsName} extends BaseSortFields {
          
          ${entity.columns.map(c => ColumnTemplate(c, generationOptions)).join("\n")}
          
          ${entity.relations.map(r => RelationTemplate(r, generationOptions)).join("\n")}
        }
      `
  }
