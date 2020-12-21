import {
  propertyIsDecoratedWithField,
  propertyIsSortIgnored,
} from "../../utils/metadata-storage";
import { Column } from "../models/column";
import { Relation } from "../models/relation";
import IGenerationOptions from "../options/generation-options.interface";
import {
  defaultExport,
  toEntityDirectoryName,
  toEntityName,
  toFileName,
  toGraphQLSortRelation,
  toGraphQLSortRelationType,
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
  const relatedTableEntityName = toEntityName(relation.relatedTable, generationOptions);
  const relatedTableSortName = toSortsName(relation.relatedTable, generationOptions);
  const propertyName = `${toSortsName(relation.fieldName, generationOptions)}?:${toGraphQLSortRelationType(relatedTableSortName, relation.relationType)};`
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
  const sortsName: string = toSortsName(entity.tscName, generationOptions);
  const ignoreMetadata = generationOptions.graphqlFiles ?? false;

  return `
        import {InputType, Field} from "type-graphql";
        import { BaseSortFields, SortField } from "merlin-gql";
        ${entity.fileImports.map(fileImport => ImportsTemplate(fileImport,generationOptions)).join("\n")}

        @InputType()
        export ${defaultExport(generationOptions)} class ${sortsName} extends BaseSortFields {
          
          ${entity.columns.filter(c => ignoreMetadata || (propertyIsDecoratedWithField(c.tscName, entity.tscName) && !propertyIsSortIgnored(c.tscName, entity.tscName))).map(c => ColumnTemplate(c, generationOptions)).join("\n")}
          
          ${entity.relations.filter(c => ignoreMetadata || (propertyIsDecoratedWithField(c.fieldName, entity.tscName) && !propertyIsSortIgnored(c.fieldName, entity.tscName))).map(r => RelationTemplate(r, generationOptions)).join("\n")}
        }
      `
}
