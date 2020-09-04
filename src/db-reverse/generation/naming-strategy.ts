/* eslint-disable @typescript-eslint/no-unused-vars */
import { plural } from "pluralize";
import * as changeCase from "change-case";
import { Relation } from "../models/relation";
import { RelationId } from "../models/relation-id";
import { Entity } from "../models/entity";
import { Column } from "../models/column";

let pluralize: boolean;

export function enablePluralization(value: boolean) {
  pluralize = value;
}

export function relationIdName(
  relationId: RelationId,
  relation: Relation,
  owner?: Entity
): string {
  const columnOldName = relationId.fieldName;

  const isRelationToMany =
    relation.relationType === "OneToMany" ||
    relation.relationType === "ManyToMany";
  let newColumnName = changeCase.camelCase(columnOldName.replace(/[0-9]$/, ""));

  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (isRelationToMany && pluralize) {
    newColumnName = plural(newColumnName);
  }

  return newColumnName;
}

export function relationName(relation: Relation, owner?: Entity): string {
  const columnOldName = relation.fieldName;

  const isRelationToMany =
    relation.relationType === "OneToMany" ||
    relation.relationType === "ManyToMany";
  let newColumnName = changeCase.camelCase(columnOldName.replace(/[0-9]$/, ""));

  if (
    newColumnName.toLowerCase().endsWith("id") &&
    !newColumnName.toLowerCase().endsWith("guid")
  ) {
    newColumnName = newColumnName.substring(
      0,
      newColumnName.toLowerCase().lastIndexOf("id")
    );
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (isRelationToMany && pluralize) {
    newColumnName = plural(newColumnName);
  }
  return newColumnName;
}

export function entityName(oldEntityName: string, entity?: Entity): string {
  return oldEntityName;
}

export function columnName(oldColumnName: string, column?: Column): string {
  return oldColumnName;
}
