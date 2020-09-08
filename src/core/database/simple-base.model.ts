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

@ObjectType({isAbstract:true})
export class SimpleBaseModel extends BaseModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Field((type) => Date)
  @Column("datetime")
  created: Date = new Date();

  @Field((type) => Date)
  @Column("datetime", { nullable: true })
  updated: Date | null = null;

  @BeforeUpdate()
  setUpdated() {
    this.updated = new Date();
  }

  @Field((type) => Boolean)
  @Column("boolean", { default: false })
  deleted: boolean = false;
}
