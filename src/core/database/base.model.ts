import {
  getConnection,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  getManager,
  EntityManager,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";


export class BaseModel {
  public static getRelations(): IRelationDefinition[] {
    return getConnection()
      .getMetadata(this)
      .relations.map((r) => ({
        name: r.propertyName,
        model: <typeof BaseModel>r.type,
      }));
  }

  public static getIdPropertyName(): string {
    return getConnection().getMetadata(this).primaryColumns[0].propertyName;
  }
  public static getIdDatabaseName(): string {
    return getConnection().getMetadata(this).primaryColumns[0].databaseName;
  }
}

export interface IRelationDefinition {
  name: string;
  model: typeof BaseModel;
}
