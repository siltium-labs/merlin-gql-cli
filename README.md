![Logo](https://i.imgur.com/4Yf8iaI.png)

[![Version](https://img.shields.io/npm/v/@merlin-gql/cli.svg)](https://npmjs.org/package/@merlin-gql/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@merlin-gql/cli.svg)](https://npmjs.org/package/@merlin-gql/cli)
[![License](https://img.shields.io/npm/l/@merlin-gql/cli.svg)](https://github.com/silentium-labs/@merlin-gql/cli/blob/master/package.json)

# Merlin GQL

**Merlin GQL** is a framework to create Graphql APIs using **_Typescript_**, **_TypeORM_** and **_TypeGraphQL_** with the objective of making the development of database oriented GraphQL APIs as simple and straightforward as possible without making compromises on customization or extensibility.

We provide solutions to common use cases with **out of the box features** to simplify and speed up the development of GraphQL APIs.

## Features

### Code Generation

Merlin GQL has a **CLI** that will generate pretty much everything you need to make a functional GraphQL API.

You can develop your API using two approaches, which are covered in the **TypeORM Entities** section of the documentation:

- Database First (doing reverse engineering on an existing database)
- Code First (writing your database entities in the code and synchronizing your database schema with _TypeORM_)

You can switch from one to the other at _any point_ and starting with either _doesn't lock you_ into using that strategy through the rest of the development cycle of your API.

### Templates

Using the CLI, you can create the basic structure of your API by selecting between a **_Basic_** and an **_Example_** template, the latter will showcase and provide example code for all of the features included in Merlin GQL along with some examples of customizations that you might find usefull. We encourage to select this template as a guide and starting point if this is your first time using this framework.

### Authentication and Authorization

This is a very common feature needed in the majority of cases when creating an API, so we decided to provide out of the box features to secure your APIs, this approach is very simple and may not be suitable for all cases, but you can customize it, extend it or completely ignore it and create your own security layer.

For more information on this feature please refer to the **Authentication and Authorization** section of the documentation.

### Data Generation

We provide some simple tools and guidelines for automatically generating testing data for your API, this step is often overlooked and will help you to create "fake" entries in your database in order to have some interesting data for your tests, measure performance, put your API in stress or simply provide a starting point for the developer and avoid an empty database.

## Getting Started

To start with Merlin GQL, we strongly recommend to install our CLI, you might find it usefull and it will speed up your development, altough _it is not required_.

> All the things done with the CLI can be done manually altough some of them might take a considerably larger ammount of time when done this way

### CLI Installation

You can use _npx_ or install it globally with _npm_, both approaches are valid and will work without any kind of problems.

If you want to install Merlin GQL globally with npm you need to run the command:

```
npm install --global @merlin-gql/cli
```

or it's short version

```
npm i -g @merlin-gql/cli
```

If you want to use _npx_ instead, you don't need to install Merlin GQL globally.

> From now on and through the rest of the guide, we will assume that you have the CLI installed globally, if you decided to use _npx_ then all you need to do is to prefix all the commands with `npx `.

### Starting a new project

With the CLI you can create a new project using the _new_ command

```
npx @merlin-gql/cli new
```

Once you run the command, the CLI will guide ask you to choose a template for your project, if you are familiar with Merlin GQL you can select the **Bascic** template, which is a template with only the bare minimum files required to create your API without any example files and without boilerplate code.

As previously recommended, if this is your first time using Merlin GQL or you want to explore it's features, we recommend to select the **Example** template.

```
MacBook-Air:$ npx @merlin-gql/cli new
? Select a starting template for your project (Use arrow keys)
❯ Basic - Contains only the very minimum required files to start.
  Example - Showcases basic functionality examples. For more info check https://github.com/silentium-labs/merlin-gql-cli
```

### Example Template

The first thing the CLI will ask you for, is the **name** of your project.

> You can use blank spaces or uppercase characters in your project name, the CLI will automatically make a **_kebab case_** version of your project name to create a folder and use that name in the generated package.json. For example, if you name your project **My App**, the CLI will create a **_my-app_** folder.

Then you will be asked for your database information in order to configure your project's database connection.

> This information is used to create the _ormconfig.json_ file and can be modified.

After you introduce your database configuration values the CLI will request a _Secret Key_ to encrypt your _JWT Authentication Tokens_, it is not required to manually provide this value, and if you opt to not provide one, we will automatically generate one for you.

> For more information regarding **JWT** and the **Secret Key** please refer to https://jwt.io/

Finally, the CLI will ask you if you want to enable _ngrok_ for remote testing or debbuging of your API.

**_ngrok_** is a tool that will create a reverse proxy to your API accessible from anywhere and will allow you to easily access your API from outside of your local machile or lan network, it is very usefull when testing your API with a mobile client or from a remote connection, we recommend to select **_yes_** and allow the CLI to configure ngrok for you.

> For more information **ngrok** and and how it does work, please refer to https://ngrok.com/

### Project Structure

Once generated, your project structure will look like this

```
.
├── dist
├── src
│   ├── _generated
│   ├── app.ts
│   ├── core
│   │   ├── database
│   │   ├── env
│   │   ├── graphql-schema.ts
│   │   └── security
│   ├── data-generator
│   │   ├── data-generator.resolver.ts
│   │   └── utils
│   ├── models
│   └── resolvers
├── tsconfig.json
├── config.development.json
├── gulpfile.js
├── merlin-gql-config.json
├── ormconfig.json
├── package-lock.json
├── package.json
└── README.md
```

Most of the configuration files like `ormconfig.json`, `merlin-gql-config.json` and `config.development.json` will already be configured with the values that were propmpted during the project creation. We will talk about each of those files in the _Configuration_ section of the docs.

### Starting the Project

All you need to do to start seing your GraphQL API in action is running the command
`npm start`

## Creating your first GraphQL Resolver

### TypeORM Entity Models

A _TypeORM Entity Models_ file is the fist of two files required to start using **Merlin GQL**.
Those live on the `src/models` folder and we suggest creating a folder for each model.
The reason for that will be evident once we review the second required file, which is the _Merlin GQL Resolver_ files.

To define a _TypeORM Entity Model_ all you need to do is create a Class that extends our _BaseModel_ and decorate it with _TypeORM Decorators_

> Although it's not required, we recommend to use the _{kebab-case-name-of-your-model}.model.ts_ naming strategy for your entity model files. eg: person.model.ts

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "@merlin-gql/core";

@Entity()
export class Person extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column("varchar")
  name: string;

  @Column("integer", { nullable: true })
  securitySocialNumber: number | null = null;
}
```

> You **MUST** extend _BaseModel_ for your code to work properly, please don't forget to do that when defining your _Entities_ otherwise you are going to get some errors.

For more information about _TypeORM Entities_ definition check the [official documentation](https://typeorm.io/#/entities)

### MerlinGQL Resolver Generators

The second file required for **Merlin GQL** to work is the _Resolver Generator_ files. This are in charge of _generating_ the code that you need for all the operations that your _GraphQL API_ will _expose_ for each one of your entities, as well as configuring things like _filtering criteria_, _sort criteria_, _input criteria_ and _security_.

We will review those settings individually later.

To create your first _Resolver Generator_ file you need to create a file within your model folder and create a class that extends the _TypeORM Entity_ and decorate it with `@MerlinGQLResolver()`

```typescript
import { MerlinGQLResolver, MerlinGQLField } from "@merlin-gql/core";
import { ID, Int } from "type-graphql";

@MerlinGQLResolver(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class PersonResolverGenerator extends Person {
  @MerlinGQLField((_) => ID)
  id!: number;

  @MerlinGQLField((_) => String)
  name!: string;

  @MerlinGQLField((_) => Int, { nullable: true })
  securitySocialNumber!: number | null;
}
```

> Although it's not **STRICTLY** required, we recommend to use the _{kebab-case-name-of-your-model}.resolver-generator.ts_ naming strategy for your entity resolver generator files. eg: person.resolver-generator.ts and put that file right next to the typeorm entity model file. Unlike the typeorm entity model file, if you decide to not use this suggestion, you need to do a change in the _merlin-gql-config.json_ file. You can find more information about that in the **Configuration** section.

At this point, it's up to your judgment what fields do you want to expose to your _GraphQL Schema_, you could pick a few or expose all your fields.

Lets analyze each piece of this code individually.
The `@MerlinGQLResolver()` decorator, tells the framework that you want this _TypeORM Entity_ exposed to the _GraphQL Schema_. It takes an _array of operations_ as argument.
Those operations belong to the **FIND** _one by id_, **LIST** _by user defined criteria_, **CREATE** _a new entity_, **UPDATE** _an existing one_ and **DELETE** _one by id_.

> You can configure the security individually for each operation if you want. Please refer to the **Security** section of the docs to see that in action.

Then, in the class we define a subset of the _TypeORM Entity properties_ and decorate them with the `@MerlinGQLField()` decorator, this decorator will tell the _GraphQL Schema_ which type of field we are using.

Once we have our _TypeORM Entity_ and _MerlinGQL Resolver Generator_ we can run the following command.

`npm run watch`

> Please make sure that your API is running while using this command, if not then on a separate shell, run `npm start`.

This will generate a bunch of files inside the `src/_generated` folder. And if we go to the _GraphQL Playground_ in `http://localhost:4000/graphql` we will have a fully functional _GraphQL API_ with the _CRUD Functionalities_ that were defined for our first _Person_ entity.

## Generated Files

Inside the `src/_generated` folder, there will be a bunch of files organized in a folder for each `MerlinGQLResolverGenerator` class.

For example for the `Person` class you will find the following inside the `_generated/person` folder.

```
.
├── person.filter.ts
├── person.input.ts
├── person.resolver.ts
└── person.sort.ts
```

### The resolver file

The `person.resolver.ts` file has the _CRUD GraphQL Resolver and Schema definitions_ for the operations that you **configured** in your `Person MerlinGQLResolverGenerator` class.

```typescript
import { CreateResolver, DeleteResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Person } from "../../models/person/person.model";
import { PersonFilters } from "./person.filter";
import { PersonCreateInput, PersonUpdateInput } from "./person.input";
import { PersonSorts } from "./person.sort";

const BaseListResolver = ListResolver(Person, PersonFilters, PersonSorts);
@Resolver()
export class PersonListResolver extends BaseListResolver<Person, PersonFilters, PersonSorts> {}

const BaseFindResolver = FindResolver(Person);
@Resolver()
export class PersonFindResolver extends BaseFindResolver<Person> {}

const BaseUpdateResolver = UpdateResolver(Person, PersonUpdateInput);
@Resolver()
export class PersonUpdateResolver extends BaseUpdateResolver<Person> {}

const BaseCreateResolver = CreateResolver(Person, PersonCreateInput);
@Resolver()
export class PersonCreateResolver extends BaseCreateResolver<Person> {}

const BaseDeleteResolver = DeleteResolver(Person);
@Resolver()
export class PersonDeleteResolver extends BaseDeleteResolver<Person> {}

```

There you can see the 5 _CRUD_ operations _(List, Find, Create, Update, Delete)_ defined.
You can select which operations you want a specific _MerlinGQLResolverGenerator_ class by modifying the list of operations. For example, lets say we only want the _List_ operation generated, then we can modify the `Person` _MerlinGQLResolverGenerator_ class with the following.

```typescript
...
@MerlinGQLResolver(["LIST"])
export class PersonResolverGenerator extends Person {
...
}
```

By only adding the **LIST** operation to the array, we are telling the generator to only generate a single _List Resolver_. So your generated resolver file will look like this:

```typescript
...

const BaseListResolver = ListResolver(Person, PersonFilters, PersonSorts);
@Resolver()
export class PersonListResolver extends BaseListResolver<Person, PersonFilters, PersonSorts> {}

```

### List Resolver

Let's analyze the pieces of the generated _List_ resolver.

First, we have a definition of a `BaseListResolverClass`. This class is part of the _MerlinGQL Core_ module and creates for us the logic to handle a _List GraphQL Query_ for our _Person TypeORM Entity_.

It allow us to define _filtering, sorting and pagination_ when executing our _GraphQL Query_.

And all that is available out of the box without writing a single line of code.

> We can also extend each individual resolver to have custom behaviour, at the end of the day the resolvers are Typescript Classes so all the rules that apply to classes apply to our generated resolvers like _inheritance_. We will discuss that topic further ahead.

If we go to the _GraphQL Playground_ of our API and execute the following query

```graphql
query {
  personList(
    criteria: {
      filter: { name: { type: LIKE, value: "z" } }
      sort: { name: { direction: ASC } }
      max: 2
    }
  ) {
    result {
      id
      name
      age
      user {
        username
      }
    }
  }
}

```

We would get the list of the first 2 `Person` entities whose name contains `z` ordered by name.

> You can also use entity relations when filtering and sorting, we will see examples of that further ahead.

### Find Resolver

Lets add **FIND** to the list of operations to generate for our `Person` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND"])
export class PersonResolverGenerator extends Person {
...
}
```

This will generate the following resolver.

```typescript
import { FindResolver, ListResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Person } from "../../models/person/person.model";
import { PersonFilters } from "./person.filter";
import { PersonSorts } from "./person.sort";

const BaseListResolver = ListResolver(Person, PersonFilters, PersonSorts);
@Resolver()
export class PersonListResolver extends BaseListResolver<Person, PersonFilters, PersonSorts> {}

const BaseFindResolver = FindResolver(Person);
@Resolver()
export class PersonFindResolver extends BaseFindResolver<Person> {}
```

As you can see, the _Find Resolver_ was added.

Now we can find a `Person`by ID on the _GraphQL API_

```graphql
query {
  personById(id: 1) {
    id
    name
  }
}
```

### Create and Update Resolver

Lets add **CREATE** and **UPDATE** to the list of operations to generate for our `Person` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND", "CREATE", "UPDATE"])
export class PersonResolverGenerator extends Person {
...
}
```

This will generate the following resolver.

```typescript
import { CreateResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Person } from "../../models/person/person.model";
import { PersonFilters } from "./person.filter";
import { PersonCreateInput, PersonUpdateInput } from "./person.input";
import { PersonSorts } from "./person.sort";

...

const BaseUpdateResolver = UpdateResolver(Person, PersonUpdateInput);
@Resolver()
export class PersonUpdateResolver extends BaseUpdateResolver<Person> {}

const BaseCreateResolver = CreateResolver(Person, PersonCreateInput);
@Resolver()
export class PersonCreateResolver extends BaseCreateResolver<Person> {}

```

As you can see, the _Create_ and _Update_ resolvers were added.

Now we can create a new `Person` and update an existing one by ID on the _GraphQL API_

```graphql
mutation {
  personCreate(data: { name: "John Doe" }) {
    id
    name
  }
}
```

```graphql
mutation {
  personUpdate(id: 1, data: { name: "John Doe" }) {
    id
    name
  }
}
```

### Delete Resolver

Lets add **DELETE** to the list of operations to generate for our `Person` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND", "CREATE", "UPDATE", "DELETED"])
export class PersonResolverGenerator extends Person {
...
}
```

At this point, since we added **ALL** the operations to our resolver generator class, we can simplify our definition changing it like the following

```typescript
...
@MerlinGQLResolver(["ALL"])
export class PersonResolverGenerator extends Person {
...
}
```

This will generate the following resolver.

```typescript
import { CreateResolver, DeleteResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Person } from "../../models/person/person.model";
import { PersonFilters } from "./person.filter";
import { PersonCreateInput, PersonUpdateInput } from "./person.input";
import { PersonSorts } from "./person.sort";

...

const BaseDeleteResolver = DeleteResolver(Person);
@Resolver()
export class PersonDeleteResolver extends BaseDeleteResolver<Person> {}

```

As you can see, the _Delete Resolver_ was added.

Now we can delete a `Person`by ID on the _GraphQL API_

```graphql
mutation {
  personDelete(id: 1) {
    id
    name
  }
}
```

> If your TypeORM Entity has logical delete configured, it will use that, if not, then it will delete the record on the database.
