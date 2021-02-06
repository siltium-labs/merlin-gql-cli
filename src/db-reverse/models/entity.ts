import { Column } from "./column";
import { Relation } from "./relation";
import { Index } from "./Index";
import { RelationId } from "./relation-id";

export type Entity = {
  sqlName: string;
  tscName: string;

  database?: string;
  schema?: string;

  columns: Column[];
  relationIds: RelationId[];
  relations: Relation[];
  indices: Index[];
  // TODO: move to sub-object or use handlebars helpers(?)
  fileImports: string[];
  generateConstructor?: true;
};
