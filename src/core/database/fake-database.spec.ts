import { SimpleBaseModel } from "./simple-base.model";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  createConnection,
  getConnection,
  getRepository,
} from "typeorm";
import { beforeEach, afterEach, it } from "mocha";
import { expect } from "chai";

@Entity()
export class Person extends SimpleBaseModel {
  @Column()
  name: string = "";
}

@Entity()
export class Purchase extends SimpleBaseModel {
  @Column()
  stamp: Date = new Date();

  @ManyToOne((_) => Person)
  customer?: Promise<Person>;
}

beforeEach(() => {
  return createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Person, Purchase],
    synchronize: true,
    logging: false,
  });
});
afterEach(() => {
  let conn = getConnection();
  return conn.close();
});

describe("Database Model", () => {
  it("should create joe and retrieve it", async () => {
    await getRepository(Person).insert({
      name: "Joe",
      created: new Date(),
    });
    let joe = await getRepository(Person).find({
      where: {
        id: 1,
      },
    });
    expect(joe[0].name).to.equal("Joe");
  });

  it("name should be string", async () => {
    await getRepository(Person).insert({
      name: "Joe",
      created: new Date(),
    });
    let joe = await getRepository(Person).find({
      where: {
        id: 1,
      },
    });
    expect(joe[0].name).to.be.string;
  });

  it("should have an id", async () => {
    await getRepository(Person).insert({
      name: "Joe",
      created: new Date(),
    });
    let joe = await getRepository(Person).find({
      where: {
        id: 1,
      },
    });
    console.log(joe[0]);
    expect(joe[0]).to.to.have.property("id");
  });

  it("should have a created property", async () => {
    await getRepository(Person).insert({
      name: "Joe",
      created: new Date(),
    });
    let joe = await getRepository(Person).find({
      where: {
        id: 1,
      },
    });
    console.log(joe[0]);
    expect(joe[0]).to.to.have.property("created");
  });
});
