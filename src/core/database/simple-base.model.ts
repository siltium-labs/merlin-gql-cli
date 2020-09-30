import { ID, ObjectType } from "type-graphql";
import { BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "../type-graphql/extended-decorators/field";
import { BaseModel } from "./../database/base.model";

@ObjectType({ isAbstract: true })
export class SimpleBaseModel extends BaseModel {
  @Field((type) => ID, undefined, true)
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Field((type) => Date, undefined, true)
  @Column("datetime")
  created: Date = new Date();

  @Field((type) => Date, undefined, true)
  @Column("datetime", { nullable: true })
  updated: Date | null = null;

  @BeforeUpdate()
  setUpdated() {
    this.updated = new Date();
  }

  @Field((type) => Boolean, undefined, true)
  @Column("boolean", { default: false })
  deleted: boolean = false;
}
