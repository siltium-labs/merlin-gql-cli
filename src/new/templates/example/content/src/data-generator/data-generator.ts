//
import { getManager, EntityManager } from "typeorm";
import bcrypt from "bcryptjs";
import { Customer } from "../models/customer/customer.model";
import { Resolver, Mutation, Field, ObjectType } from "type-graphql";
import { isProduction } from "../core/env/env";
import { Purchase } from "../models/purchase/purchase.model";
import { Person } from "../models/person/person.model";
import { RolesEnum } from "../core/security/security.functions";
import { Role } from "../models/role/role.model";
import { User } from "../models/user/user.model";
import { ArrayUtils } from "./utils/array-utils";
import { StringUtils } from "./utils/string-utils";
import { NumberUtils } from "./utils/number-utils";

export const names: string[] = [
  "Santiago",
  "Sebastián",
  "Matías",
  "Mateo",
  "Nicolás",
  "Alejandro",
  "Diego",
  "Samuel",
  "Benjamín",
  "Daniel",
  "Joaquín",
  "Lucas",
  "Tomas",
  "Gabriel",
  "Martín",
  "David",
  "Emiliano",
  "Jerónimo",
  "Emmanuel",
  "Agustín",
  "Juan Pablo",
  "Juan José",
  "Andrés",
  "Thiago",
  "Leonardo",
  "Felipe",
  "Ángel",
  "Maximiliano",
  "Christopher",
  "Juan Diego",
  "Adrián",
  "Pablo",
  "Miguel Ángel",
  "Rodrigo",
  "Alexander",
  "Ignacio",
  "Emilio",
  "Dylan",
  "Bruno",
  "Carlos",
  "Vicente",
  "Valentino",
  "Santino",
  "Julián",
  "Juan Sebastián",
  "Aarón",
  "Lautaro",
  "Axel",
  "Fernando",
  "Ian",
  "Christian",
  "Javier",
  "Manuel",
  "Luciano",
  "Francisco",
  "Juan David",
  "Iker",
  "Facundo",
  "Rafael",
  "Alex",
  "Franco",
  "Antonio",
  "Luis",
  "Isaac",
  "Máximo",
  "Pedro",
  "Ricardo",
  "Sergio",
  "Eduardo",
  "Bautista",
  "Miguel",
  "Cristóbal",
  "Kevin",
  "Jorge",
  "Alonso",
  "Anthony",
  "Simón",
  "Juan",
  "Joshua",
  "Diego Alejandro",
  "Juan Manuel",
  "Mario",
  "Alan",
  "Josué",
  "Gael",
  "Hugo",
  "Matthew",
  "Ivan",
  "Damián",
  "Lorenzo",
  "Juan Martín",
  "Esteban",
  "Álvaro",
  "Valentín",
  "Dante",
  "Jacobo",
  "Jesús",
  "Camilo",
  "Juan Esteban",
  "Elías",
];

export const lastNames = [
  "García",
  "Fernández",
  "González",
  "Rodríguez",
  "López",
  "Martínez",
  "Sánchez",
  "Pérez",
  "Martín",
  "Gómez",
  "Dominguez",
  "Hernandez",
  "Lopez",
  "Ramirez",
  "Ruiz",
  "Suarez",
  "Velazquez",
  "Velez",
  "Bravo",
  "Cano",
  "Cola",
  "Cortes",
  "Delgado",
  "Garza",
  "Grand",
  "Moreno",
  "Orejon",
  "Rubio",
];

export const emailTerminations = [
  "@live.com",
  "@outlook.com",
  "@gmail.com",
  "@yahoo.com",
  "@mail.com",
];

export const loadRoles = async (em: EntityManager) => {
  const roles: { [key: string]: Role } = {};
  const administrator = new Role();
  administrator.name = RolesEnum.Administrator;
  roles[RolesEnum.Administrator] = await em.save(administrator);

  const dashboardViewer = new Role();
  dashboardViewer.name = RolesEnum.Anonymous;
  roles[RolesEnum.Anonymous] = await em.save(dashboardViewer);

  const dashboardDesigner = new Role();
  dashboardDesigner.name = RolesEnum.User;
  roles[RolesEnum.User] = await em.save(dashboardDesigner);

  return roles;
};

export const loadUsers = async (
  em: EntityManager,
  roles: { [key: string]: Role }
) => {
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    let hasValidName = false;
    let userName = "";
    let firstName = "";
    let lastName = "";
    let email = "";
    while (!hasValidName) {
      firstName = ArrayUtils.randomFrom(names);
      lastName = ArrayUtils.randomFrom(lastNames);
      userName =
        i === 0
          ? "demo@demo.com"
          : StringUtils.removeAccents(
              firstName.toLowerCase() +
                "_" +
                lastName.toLowerCase() +
                ArrayUtils.randomFrom(emailTerminations)
            );
      hasValidName = !users.some((user) => user.username === userName);
      email =
        i === 0
          ? "demo@demo.com"
          : StringUtils.removeAccents(
              firstName.toLowerCase() +
                "_" +
                lastName.toLowerCase() +
                ArrayUtils.randomFrom(emailTerminations)
            );
      hasValidName = !users.some((user) => user.username === userName);
    }
    const user = new User();
    user.username = userName;
    user.password = await bcrypt.hash("Aa123456", 10);
    user.email = email;
    user.roles = Promise.resolve([roles[RolesEnum.Administrator]]);

    const savedUser = await em.save(user);
    users.push(savedUser);
  }
  return users;
};

export const loadCustomers = async (em: EntityManager) => {
  const customers: Customer[] = [];
  for (let i = 0; i < 50; i++) {
    const customer = new Customer();
    customer.name = `${ArrayUtils.randomFrom(names)} ${ArrayUtils.randomFrom(
      lastNames
    )}`;
    const saved = await em.save(customer);
    customers.push(saved);
  }
  return customers;
};

export const loadPeople = async (em: EntityManager, users: User[]) => {
  const people: Person[] = [];
  for (let i = 0; i < 10; i++) {
    const person = new Person();
    person.name = `${ArrayUtils.randomFrom(names)} ${ArrayUtils.randomFrom(
      lastNames
    )}`;
    person.age = NumberUtils.randomBetween(18, 79);
    person.user = Promise.resolve(users[i]);
    const saved = await em.save(person);
    people.push(saved);
  }
  return people;
};

export const loadPurchases = async (
  em: EntityManager,
  customers: Customer[]
) => {
  const purchases: Purchase[] = [];
  for (let i = 0; i < 100; i++) {
    const purchase = new Purchase();
    purchase.total = NumberUtils.randomBetween(100, 1000000) / 10;
    purchase.customer = Promise.resolve(ArrayUtils.randomFrom(customers));
    purchase.secret = Math.random().toString(36).substring(7);
    const saved = await em.save(purchase);
    purchases.push(saved);
  }
  return purchases;
};

export const generateData = async () => {
  await getManager().transaction(async (em) => {
    try {
      const roles = await loadRoles(em);
      const users = await loadUsers(em, roles);
      const customers = await loadCustomers(em);
      const purchases = await loadPurchases(em, customers);
      const people = await loadPeople(em, users);
    } catch (e) {
      console.log("Error when genereting data: ", e);
      throw e;
    }
  });
};

@ObjectType()
export class SuccessOrError {
  @Field()
  ok: boolean = true;
}

@Resolver()
export class DataGeneratorResolver {
  @Mutation((type) => SuccessOrError)
  async generateData() {
    if (!isProduction) {
      await generateData();
      return {
        ok: true,
      };
    } else {
      throw "only available in non production environments";
    }
  }
}
