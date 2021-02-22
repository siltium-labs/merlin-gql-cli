import {
  propertyIsDecoratedWithField,
  propertyIsSortIgnored,
} from "@merlin-gql/core";
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
import { TemplateUtils } from "./utils/template.utils";

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
    @Field((_) => SortField, { nullable: true })
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
  const propertyName = `${toPropertyName(relation.fieldName, generationOptions)}?:${toGraphQLSortRelationType(relatedTableSortName, relation.relationType)};`
  return `
    @Field((_) => ${toGraphQLSortRelation(relatedTableEntityName, relation.relationType)}, { nullable: true })
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
  const relations = entity.relations.filter(c => ignoreMetadata || (propertyIsDecoratedWithField(c.fieldName, entity.tscName) && !propertyIsSortIgnored(c.fieldName, entity.tscName)))
  const columns = entity.columns.filter(c => ignoreMetadata || (c.tscName && propertyIsDecoratedWithField(c.tscName, entity.tscName) && !propertyIsSortIgnored(c.tscName, entity.tscName) && !relations.map(r => r.fieldName).includes(c.tscName)))
  return `
        import {InputType, Field} from "type-graphql";
        import { BaseSortFields, SortField } from "@merlin-gql/core";
        ${TemplateUtils.removeDuplicated(entity.fileImports).map(fileImport => ImportsTemplate(fileImport, generationOptions)).join("\n")}

        @InputType()
        export ${defaultExport(generationOptions)} class ${sortsName} extends BaseSortFields {

          ${columns.map(c => ColumnTemplate(c, generationOptions)).join("\n")}

          ${relations.map(r => RelationTemplate(r, generationOptions)).join("\n")}
        }
      `
}
