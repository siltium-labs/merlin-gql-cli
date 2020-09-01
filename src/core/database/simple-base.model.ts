import { BaseModel } from "./../database/base.model";
import {
  getConnection,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  getManager,
  EntityManager,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class SimpleBaseModel extends BaseModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Field(type => Date)
  @Column("timestamp")
  created: Date = new Date();

  @Field(type => Date)
  @Column("timestamp", { nullable: true })
  updated: Date | null = null;

  @BeforeUpdate()
  setUpdated() {
    this.updated = new Date();
  }

  @Field(type => Boolean)
  @Column("boolean", { default: false })
  deleted: boolean = false;
}
