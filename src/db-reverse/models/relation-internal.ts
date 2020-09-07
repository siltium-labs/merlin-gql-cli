import { OnDeleteType } from "typeorm/metadata/types/OnDeleteType";
import { OnUpdateType } from "typeorm/metadata/types/OnUpdateType";
import { Entity } from "./entity";

export type RelationInternal = {
  ownerTable: Entity;
  relatedTable: Entity;
  ownerColumns: string[];
  relatedColumns: string[];
  onDelete?: OnDeleteType;
  onUpdate?: OnUpdateType;
};
