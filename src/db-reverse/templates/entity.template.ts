import { JoinColumnOptions } from "typeorm";
import { Index } from "../models";
import { Column } from "../models/column";
import { Relation } from "../models/relation";
import IGenerationOptions from "../options/generation-options.interface";
import {
  defaultExport,
  printPropertyVisibility,
  toEntityDirectoryName,
  toEntityFileName,
  toEntityName,
  toJson,
  toLocalImport,
  toPropertyName,
  toRelation,
} from "./../generation/model-generation";
import { Entity } from "./../models/entity";
import { RelationId } from "./../models/relation-id";

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

// prettier-ignore
const ImportsTemplate = (fileImport: string, generationOptions: IGenerationOptions) => {
    //Handlebars: import {{localImport (toEntityName .)}} from "../{{toEntityDirectoryName .}}/{{toEntityFileName .}}"

    return `
    import ${toLocalImport(toEntityName(fileImport, generationOptions), generationOptions)} from "../${toEntityDirectoryName(fileImport, generationOptions)}/${toEntityFileName(fileImport, generationOptions)};"
    `;
};

// prettier-ignore
const IndexTemplate = (index: Index,  generationOptions: IGenerationOptions) => {
    //Handlebars: @Index("{{name}}",[{{#columns}}"{{toPropertyName .}}",{{/columns~}}],{ {{json options}} })    

    return `
    @Index(${index.name}), [${index.columns.map(c => toPropertyName(c, generationOptions)).join(",")} ], ${toJson(index.options)}}
    `;
};

// prettier-ignore
const ColumnTemplate = (
  entity: Entity,
  column: Column,
  generationOptions: IGenerationOptions
) => {
  //Handlebars: 
  // {{#generated}}@PrimaryGeneratedColumn({ type:"{{type}}", {{/generated}}{{^generated}}@Column("{{type}}",{
  // {{#primary}}primary:{{primary}},{{/primary}}{{/generated}}{{json options}}{{#default}},default: {{.}},{{/default}} })
  // {{#if (eq (toPropertyName tscName) "deletedAt") }}@DeleteDateColumn(){{/if}}
  // {{printPropertyVisibility}}{{toPropertyName tscName}}{{strictMode}}:{{tscType}}{{#if options.nullable}}| null{{/if}}
  // {{#if options.nullable}} = null;
  // {{else if (eq tscType "string")}} = "";
  // {{else if (eq tscType "number")}} = 0;
  // {{else if (eq tscType "Date")}} = new Date();
  // {{else if (eq tscType "boolean")}} = false;
  // {{/if}}
  
  const propertyName = toPropertyName(column.tscName, generationOptions);  
  const defaultValue = defaultValueIfNeeded(
    !!column.options.nullable,
    column.tscType
  );
  const primary = column.primary ? `primary: ${column.primary}, `: "";
  const options = toJson(column.options);
  const _default = column.default ? `, default: ${column.default} `: "";  
  const generated = column.generated ? 
    `@PrimaryGeneratedColumn({ type:"${column.type}", ${options}${_default}})` : 
    `@Column("${column.type}",{${primary}${options}${_default}})`;
  const deletedAt = propertyName === "deletedAt" ? "@DeleteDateColumn()" : "";

  return `
    ${generated}
    ${deletedAt}
    ${printPropertyVisibility(generationOptions)} ${propertyName} ${generationOptions.strictMode}:${column.tscType}${column.options.nullable ? " | null" : ""} ${defaultValue}
  `;
};

// prettier-ignore
const JoinColumnOptionsTemplate = (
  joinColumnsOptions: JoinColumnOptions,
  generationOptions: IGenerationOptions
) => {
  //Handlebars: { name: "{{name}}", referencedColumnName: "{{toPropertyName referencedColumnName}}" },

  const referenceColumnName = toPropertyName(joinColumnsOptions.referencedColumnName!, generationOptions);
  return `{name: "${joinColumnsOptions.name}",  referencedColumnName: "${referenceColumnName}"}`;
};

// prettier-ignore
const RelationTemplate = (
  entity: Entity,
  relation: Relation,
  generationOptions: IGenerationOptions
  ) => {
  //HanldeBars:  
  // @{{relationType}}(()=>{{toEntityName relatedTable}},{{toPropertyName relatedTable}}=>{{toPropertyName relatedTable}}.{{toPropertyName relatedField}}{{#if relationOptions}},{
  // {{json relationOptions}} }{{/if}})
  // {{#if joinColumnOptions}}@JoinColumn([{{#joinColumnOptions}}{{> JoinColumnOptions}}{{/joinColumnOptions}}]){{/if}}
  // {{#joinTableOptions}}@JoinTable({ name:"{{name}}",
  // joinColumns:[{{#joinColumns}}{{> JoinColumnOptions}}{{/joinColumns}}],
  //inverseJoinColumns:[{{#inverseJoinColumns}}{{> JoinColumnOptions}}{{/inverseJoinColumns}}],
  //{{#database}}database:"{{.}}",{{/database}}{{#schema}}schema:"{{.}}"{{/schema}}
  // }){{/joinTableOptions}}
  // {{printPropertyVisibility}}{{toPropertyName fieldName}}?:{{toRelation (toEntityName relatedTable) relationType}};

    const relatedTableEntityName = toEntityName(relation.relatedTable, generationOptions);
    const relatedTablePorpertyName = toPropertyName(relation.relatedTable, generationOptions);
    const relatedFieldPropertyName = toPropertyName(relation.relatedField, generationOptions);
    const relationOptions = relation.relationOptions ? `${toJson(relation.relationOptions)}` : "";
    const joinColumnsOptions = relation.joinColumnOptions ? `
    @JoinColumn([${relation.joinColumnOptions.map(jc => JoinColumnOptionsTemplate(jc, generationOptions)).join(",")}])
    ` : "";
    const joinTableOptions = `@JoinTable({ name:"${relation.joinTableOptions}",
    joinColumns:[${relation.joinTableOptions?.joinColumns?.map(jc => JoinColumnOptionsTemplate(jc, generationOptions)).join(",")}],
    inverseJoinColumns:[${relation.joinTableOptions?.inverseJoinColumns?.map(jc => JoinColumnOptionsTemplate(jc, generationOptions)).join(",")}],
    ${entity.database ? `database: "${entity.database}",`: ""} 
    ${entity.schema ? `schema: "${entity.schema}"`: ""}
    `;
    
    const propertyName = `${printPropertyVisibility(generationOptions)}${toPropertyName(relation.fieldName, generationOptions)}?:${toRelation(relatedTableEntityName, relation.relationType, generationOptions)};`
    return `
    @${relation.relationType} (() => ${relatedTableEntityName}, ${relatedTablePorpertyName} => ${relatedTablePorpertyName}.${relatedFieldPropertyName})
    ${relationOptions}
    ${joinColumnsOptions}
    ${joinTableOptions}
    ${propertyName}
    `;
  };

// prettier-ignore
const RelationIdTemplate = (
  entityName: string,
  relationId: RelationId,
  generationOptions: IGenerationOptions
) => {
  //Handlebars: @RelationId(({{toPropertyName entityName}}:{{toEntityName entityName}})=>{{toPropertyName entityName}}.{{toPropertyName relationField}})
  //{{printPropertyVisibility}}{{toPropertyName fieldName}}?:{{fieldType}};

  const inputProperty = `${toPropertyName(entityName, generationOptions)}:${toEntityName(entityName, generationOptions)}`
  const relationProperty = `${toPropertyName(entityName, generationOptions)}.${toPropertyName(relationId.relationField,generationOptions)}`;
  const field = `${toPropertyName(relationId.fieldName, generationOptions)}?:${relationId.fieldType}`;
  return `
  @RelationId((${inputProperty})=>${relationProperty})
  ${printPropertyVisibility(generationOptions)} ${field};
  `;
};

// prettier-ignore
const constructorTemplate = (
  entityName: string,
  generationOptions: IGenerationOptions
) => {
  //Hanldebars: {{printPropertyVisibility}}constructor(init?: Partial<{{toEntityName entityName}}>) {Object.assign(this, init);}

  const entity = toEntityName(entityName,generationOptions);
  return `
  ${printPropertyVisibility(generationOptions)} constructor(init?: Partial<${entity}>){
    Object.assign(this, init);
  }
  `;
};

// prettier-ignore
export const EntityTemplate = (    
    entity: Entity,
    generationOptions: IGenerationOptions
): string => {          
  //Handlebars:
    // {{#indices}}{{> Index}}{{/indices~}}   
    // @Entity("{{sqlName}}"{{#schema}} ,{schema:"{{.}}"{{#if ../database}}, database:"{{../database}}"{{/if}} }
    // {{/schema}})    
    // export {{defaultExport}} class {{toEntityName tscName}} extends BaseModel {

    // {{#columns}}{{> Column}}{{/columns~}}

    // {{#relations}}{{> Relation}}{{/relations~}}

    // {{#relationIds}}{{> RelationId entityName=../tscName}}{{/relationIds~}}
    // {{#if generateConstructor}}{{>Constructor entityName=tscName}}{{/if~}}
    // }

  const entityName:string = toEntityName(entity.tscName, generationOptions);  
  const schema = entity.schema ? `, { schema:"${entity.schema}` : "";
  const database = entity.database ? `, database: ${entity.database}` : ";"
  const schemaDatabase = entity.schema ? `${schema}${database} }` : "";
    
  return `
        import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId,DeleteDateColumn} from "typeorm";        
        ${entity.fileImports.map(fileImport => ImportsTemplate(fileImport,generationOptions)).join("/n")}

        ${entity.indices.map(index => IndexTemplate(index, generationOptions)).join("/n")}
        @Entity("${entity.sqlName}" ${schemaDatabase})
        export ${defaultExport(generationOptions)} class ${entityName} extends BaseModel {
          
          ${entity.columns.map(c => ColumnTemplate(entity, c, generationOptions)).join("/n")}
          
          ${entity.relations.map(r => RelationTemplate(entity, r, generationOptions)).join("/n")}

          ${entity.relationIds.map(ri => RelationIdTemplate(entityName, ri, generationOptions)).join("/n")}

          ${entity.generateConstructor ? constructorTemplate(entityName, generationOptions) : ""}
        }
      `
  }
