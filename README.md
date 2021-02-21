![Logo](https://i.imgur.com/4Yf8iaI.png)

[![Version](https://img.shields.io/npm/v/@merlin-gql/cli.svg)](https://npmjs.org/package/@merlin-gql/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@merlin-gql/cli.svg)](https://npmjs.org/package/@merlin-gql/cli)
[![License](https://img.shields.io/npm/l/@merlin-gql/cli.svg)](https://github.com/silentium-labs/@merlin-gql/cli/blob/master/package.json)

# Merlin GQL

**Merlin GQL** is a framework for developing Graphql APIs using **_Typescript_**, **_TypeORM_** and **_TypeGraphQL_** created to make the development of database oriented GraphQL APIs as simple and straightforward as possible without making compromises on customization or extensibility.

It provides solutions to common use cases with **out of the box features** to simplify and speed up the development of GraphQL APIs.

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

### Starting a new project

With the CLI you can create a new project using the _new_ command

```
npx @merlin-gql/cli new
```

Once you run the command, the CLI will ask you to choose a template for your project, if you are familiar with Merlin GQL you can select the **Bascic** template, which is a template with only the bare minimum files required to create your API without any example files and without boilerplate code.

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

> Although it's not required, we recommend to use the _{kebab-case-name-of-your-model}.model.ts_ naming strategy for your entity model files. eg: product.model.ts

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "@merlin-gql/core";

@Entity()
export class Product extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column("varchar")
  name: string;

  @Column("integer", { nullable: true })
  securitySocialNumber: number | null = null;
}
```

> You **MUST** extend _BaseModel_ for your code to work properly, please don't forget to do that when defining your _Entities_ otherwise you are going to get some errors.

> You **MUST** provide a default value for your entity properties, this is due to how limited Reflection is in Typescript, and it's a good practice anyways. To prevent users from forgetting about this point, the `tsconfig.json` file has __scrict mode__ activated.

For more information about _TypeORM Entities_ definition check the [official documentation](https://typeorm.io/#/entities)

### MerlinGQL Resolver Generators

The second file required for **Merlin GQL** to work is the _Resolver Generator_ files. This are in charge of _generating_ the code that you need for all the operations that your _GraphQL API_ will _expose_ for each one of your entities, as well as configuring things like _filtering criteria_, _sort criteria_, _input criteria_ and _security_.

We will review those settings individually later.

To create your first _Resolver Generator_ file you need to create a file within your model folder and create a class that extends the _TypeORM Entity_ and decorate it with `@MerlinGQLResolver()`

```typescript
import { MerlinGQLResolver, MerlinGQLField } from "@merlin-gql/core";
import { ID, Int } from "type-graphql";
import { Product } from "./product.model";

@MerlinGQLResolver(["FIND", "LIST", "CREATE", "UPDATE", "DELETE"])
export class ProductResolverGenerator extends Product {
  @MerlinGQLField((_) => ID)
  id!: any;

  @MerlinGQLField((_) => String)
  name!: any;

  @MerlinGQLField((_) => Int, { nullable: true })
  price!: any;
}
```

> Although it's not **STRICTLY** required, we recommend to use the _{kebab-case-name-of-your-model}.resolver-generator.ts_ naming strategy for your entity resolver generator files. eg: product.resolver-generator.ts and put that file right next to the typeorm entity model file. Unlike the typeorm entity model file, if you decide to not use this suggestion, you need to do a change in the _merlin-gql-config.json_ file. You can find more information about that in the **Configuration** section.

At this point, it's up to your judgment what fields do you want to expose to your _GraphQL Schema_, you could pick a few or expose all your fields.

Lets analyze each piece of this code individually.
The `@MerlinGQLResolver()` decorator, tells the framework that you want this _TypeORM Entity_ exposed to the _GraphQL Schema_. It takes an _array of operations_ as argument.
Those operations are: **FIND** _one by id_, **LIST** _by user defined criteria_, **CREATE** _a new entity_, **UPDATE** _an existing one_ and **DELETE** _one by id_.

> You can configure __Authentication and Authorization__ individually for each operation if you want. Please refer to the **Security** section of the docs to see that in action.

Then, in the class we define a subset of the _TypeORM Entity properties_ and decorate them with the `@MerlinGQLField()` decorator, this decorator will tell the _GraphQL Schema_ which type of field we are using.

Once we have our _TypeORM Entity_ and _MerlinGQL Resolver Generator_ we can run the following command.

`npm run watch`

> Please make sure that your API is running while using this command, if not then on a separate shell, run `npm start`.

This will generate a bunch of files inside the `src/_generated` folder. And if we go to the _GraphQL Playground_ in `http://localhost:4000/graphql` we will have a fully functional _GraphQL API_ with the _CRUD Functionalities_ that were defined for our first _Product_ entity.

## Generated Files

Inside the `src/_generated` folder, there will be a bunch of files organized in a folder for each `MerlinGQLResolverGenerator` class.

For example, for the `Product` class you will find the following inside the `_generated/product` folder.

```
.
├── product.filter.ts
├── product.input.ts
├── product.resolver.ts
└── product.sort.ts
```

### The Resolver File

The `product.resolver.ts` file has the _CRUD GraphQL Resolver and Schema definitions_ for the operations that you **configured** in your `Product MerlinGQLResolverGenerator` class.

```typescript
import { CreateResolver, DeleteResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Product } from "../../models/product/product.model";
import { ProductFilters } from "./product.filter";
import { ProductCreateInput, ProductUpdateInput } from "./product.input";
import { ProductSorts } from "./product.sort";

const BaseListResolver = ListResolver(Product, ProductFilters, ProductSorts);
@Resolver()
export class ProductListResolver extends BaseListResolver<Product, ProductFilters, ProductSorts> {}

const BaseFindResolver = FindResolver(Product);
@Resolver()
export class ProductFindResolver extends BaseFindResolver<Product> {}

const BaseUpdateResolver = UpdateResolver(Product, ProductUpdateInput);
@Resolver()
export class ProductUpdateResolver extends BaseUpdateResolver<Product> {}

const BaseCreateResolver = CreateResolver(Product, ProductCreateInput);
@Resolver()
export class ProductCreateResolver extends BaseCreateResolver<Product> {}

const BaseDeleteResolver = DeleteResolver(Product);
@Resolver()
export class ProductDeleteResolver extends BaseDeleteResolver<Product> {}

```

There you can see the 5 _CRUD_ operations _(List, Find, Create, Update, Delete)_ defined.
You can select which operations you want in the _MerlinGQLResolverGenerator_ class by modifying the list of operations. For example, lets say we only want the __LIST__ operation generated, then we can modify the `Product` _MerlinGQLResolverGenerator_ class with the following.

```typescript
...
@MerlinGQLResolver(["LIST"])
export class ProductResolverGenerator extends Product {
...
}
```

By only adding the **LIST** operation to the array, we are telling the generator to only generate a single _List Resolver_. So your generated resolver file will look like this:

```typescript
...

const BaseListResolver = ListResolver(Product, ProductFilters, ProductSorts);
@Resolver()
export class ProductListResolver extends BaseListResolver<Product, ProductFilters, ProductSorts> {}

```

### List Resolver

Let's analyze the pieces of the generated _List_ resolver.

First, we have a definition of a `BaseListResolverClass`. This class is part of the _MerlinGQL Core_ module and creates for us the logic to handle a _List GraphQL Query_ for our _Product TypeORM Entity_.

It allows us to define _filtering, sorting and pagination_ when executing our _GraphQL Query_.

And all that is available out of the box without writing a single line of code!

> We can also extend each individual resolver to have custom behaviour, at the end of the day the resolvers are Typescript Classes so all the rules that apply to classes apply to our generated resolvers like _inheritance_. We will discuss that topic further ahead.

If we go to the _GraphQL Playground_ of our API and execute the following query

```graphql
query {
  productList(
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

We would get a list of the first 2 `Product` entities whose name contains `z` ordered by name.

> You can also use entity relations when filtering and sorting, we will see examples of that further ahead.

#### Filtering and Sorting

Filtering and Sorting is one of the most flexible and powerfull features of `MerlinGQL` and is deeply integrated with your _TypeORM Schema_ definition. All the properties that you can filter by are typed in the _GraphQL Schema_ so you don't need to worry about making mistakes when defining your filter criteria.

You can also use and/or expressions when filtering your _Entities_ creating very flexible queries.


```graphql
query {
  productList(
    criteria: {
      filter: {
        or: [
          { name: { type: LIKE, value: "Coca" } }
          {
            and: [
              { name: { type: LIKE, value: "P" } }
              { category: { name: { type: EQUALS, value: "Snacks" } } }
            ]
          }
        ]
      }
    }
  ) {
    result {
      id
      name
      category {
        name
      }
    }
  }
}

```

> If you noticed the _category_ property being used for filtering, don't worry. We are going to see how to split products into _categories_ using _TypeORM Entity relations_ in a moment.

### Find Resolver

Lets add **FIND** to the list of operations to generate for our `Product` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND"])
export class ProductResolverGenerator extends Product {
...
}
```

This will generate the following resolver.

```typescript
import { FindResolver, ListResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Product } from "../../models/product/product.model";
import { ProductFilters } from "./product.filter";
import { ProductSorts } from "./product.sort";

const BaseListResolver = ListResolver(Product, ProductFilters, ProductSorts);
@Resolver()
export class ProductListResolver extends BaseListResolver<Product, ProductFilters, ProductSorts> {}

const BaseFindResolver = FindResolver(Product);
@Resolver()
export class ProductFindResolver extends BaseFindResolver<Product> {}
```

As you can see, the _Find Resolver_ was added.

Now we can find a `Product`by ID on the _GraphQL API_

```graphql
query {
  productById(id: 1) {
    id
    name
  }
}
```

### Create and Update Resolver

Lets add **CREATE** and **UPDATE** to the list of operations to generate for our `Product` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND", "CREATE", "UPDATE"])
export class ProductResolverGenerator extends Product {
...
}
```

This will generate the following resolver.

```typescript
import { CreateResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Product } from "../../models/product/product.model";
import { ProductFilters } from "./product.filter";
import { ProductCreateInput, ProductUpdateInput } from "./product.input";
import { ProductSorts } from "./product.sort";

...

const BaseUpdateResolver = UpdateResolver(Product, ProductUpdateInput);
@Resolver()
export class ProductUpdateResolver extends BaseUpdateResolver<Product> {}

const BaseCreateResolver = CreateResolver(Product, ProductCreateInput);
@Resolver()
export class ProductCreateResolver extends BaseCreateResolver<Product> {}

```

As you can see, the _Create_ and _Update_ resolvers were added.

Now we can create a new `Product` and update an existing one by ID on the _GraphQL API_

```graphql
mutation {
  productCreate(data: { name: "John Doe" }) {
    id
    name
  }
}
```

```graphql
mutation {
  productUpdate(id: 1, data: { name: "John Doe" }) {
    id
    name
  }
}
```

### Delete Resolver

Lets add **DELETE** to the list of operations to generate for our `Product` entity.

```typescript
...
@MerlinGQLResolver(["LIST", "FIND", "CREATE", "UPDATE", "DELETED"])
export class ProductResolverGenerator extends Product {
...
}
```

At this point, since we added **ALL** the operations to our resolver generator class, we can simplify our definition changing it like the following

```typescript
...
@MerlinGQLResolver(["ALL"])
export class ProductResolverGenerator extends Product {
...
}
```

This will generate the following resolver.

```typescript
import { CreateResolver, DeleteResolver, FindResolver, ListResolver, UpdateResolver } from "@merlin-gql/core";
import { Resolver } from "type-graphql";
import { Product } from "../../models/product/product.model";
import { ProductFilters } from "./product.filter";
import { ProductCreateInput, ProductUpdateInput } from "./product.input";
import { ProductSorts } from "./product.sort";

...

const BaseDeleteResolver = DeleteResolver(Product);
@Resolver()
export class ProductDeleteResolver extends BaseDeleteResolver<Product> {}

```

As you can see, the _Delete Resolver_ was added.

Now we can delete a `Product`by ID on the _GraphQL API_

```graphql
mutation {
  productDelete(id: 1) {
    id
    name
  }
}
```

> If your TypeORM Entity has logical delete configured, it will use that, if not, then it will delete the record on the database.

## GraphQL Subscriptions

Each _MerlinGQL Resolver_ comes with subscriptions that you can use to get notified of _CREATE, UPDATE and DELETE_ events for your entities.

```graphql
subscription {
  productCreate {
    id
    name
  }
}
```

```graphql
subscription {
  productUpdate {
    id
    name
  }
}
```

```graphql
subscription {
  productDelete {
    id
    name
  }
}
```

### TypeORM Entity Relations

One of the most interesting features of _Merlin GQL_ is how it handles relationships between entities in your _Database Schema_ and maps that to the _GraphQL Schema_.

Let's say your bussiness rules require to categorize your products, then you need to add a _Category_ entity and make your products split into categories.

To do that, let's add a `category` folder inside `src/models` and let's create a `category.model.ts`file in that folder.

```typescript
import { BaseModel } from "@merlin-gql/core";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.model";


@Entity()
export class Category extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column("varchar", { nullable: true })
    name: string | null = null;

    @OneToMany(_ => Product, "category")
    products?: Promise<Product[]>;
}
```

and now let's add the `@ManyToOne()` relation inside our existing `product.model.ts` file.

```typescript
import { BaseModel } from "@merlin-gql/core";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.model";

@Entity()
export class Product extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column("varchar", { nullable: true })
    name: string | null = null;

    @Column("float")
    price: number = 0;

    @ManyToOne(_ => Category, "products")
    category?: Promise<Category>;

    @Column("integer", { nullable: true })
    categoryId: number | null = null;
}
```

> Notice that we added an extra categoryId `@Column()` property. This isn't required altough recommended, because it will allow you to use this _id_ field on mutations to create or change the _category_ of the _product_.

Now we need to expose the newly created _Category TypeORM Entity_ and the _category_ and _categoryId_ properties of the existing _Product TypeORM Entity_ to the _GraphQL Schema_. To do that we first create a _MerlinGQL Resolver Generator_ file inside the `src/models/category` folder named `category.resolver-generator.ts`.

```typescript
import { Field, MerlinGQLField, MerlinGQLResolver } from "@merlin-gql/core";
import { ID } from "type-graphql";
import { Category } from "./category.model";

@MerlinGQLResolver([
   "ALL"
])
export class CategoryResolverGenerator extends Category {
   @MerlinGQLField(_ => ID)
   id!: any;

   @MerlinGQLField(_ => String, { nullable: true })
   name!: any;
}
```

and now we add the _category_ and _categoryId_ fields to the `src/models/product/product.resolver-generator.ts` file:

```typescript
import { MerlinGQLField, MerlinGQLResolver, NoSort } from "@merlin-gql/core";
import { Float, ID, Int } from "type-graphql";
import { Product } from "./product.model";
import { Category } from "../category/category.model";

@MerlinGQLResolver([
    "ALL"
])
export class ProductResolverGenerator extends Product {

   ...

   @MerlinGQLField(_ => Category)
   category!:any;

   @MerlinGQLField(_ => ID)
   categoryId!:any;
}
```

Now that _Category_ is added and the relationship between _Category_ and _Product_ is configured, we can use it everywhere on our _Queries, Mutations and Subscriptions_.

For example we could __LIST__ all the _Products_ that belong to the _Categories_ `Beverages` and `Snacks` and sort them by `name` of the _Category_.

```graphql
query {
  productList(
    criteria: {
      filter: {
        category: { name: { type: IN, value: ["Beverages", "Snacks"] } }
      }
      sort: { category: { name: { direction: ASC } } }
    }
  ) {
    result {
      id
      name
      category {
        name
      }
    }
  }
}
```
Or we could retrieve some fields of the _Category_ when creating a Product

```graphql
mutation {
  productCreate(data: { name: "3D", categoryId: 2 }) {
    id
    name
    category {
      id
      name
    }
  }
}
```

### Filter and Sort Files

As seen in previous examples the __LIST__ resolver allows to _filter_ and _sort_ the results based on user defined criteria.

The fields that you can _filter_ and _sort_ by are defined in `src/_generated/{entity name}.filter.ts` and `src/_generated/{entity name}.sort.ts` respectively.

Lets take a look at the generated sort and filter files for our _Product_ TypeORM Entity

`product.filter.ts`
```typescript
import { BaseFilterFields, FilteredFloat, FilteredID, FilteredInt, FilteredString } from "@merlin-gql/core";
import { Field, InputType } from "type-graphql";
import { CategoryFilters } from "../category/category.filter";

@InputType()
export class ProductFilters extends BaseFilterFields {
    @Field((_) => [ProductFilters], { nullable: true })
    or?: ProductFilters[];

    @Field((_) => [ProductFilters], { nullable: true })
    and?: ProductFilters[];

    @Field((_) => FilteredID, { nullable: true })
    id?: number;

    @Field((_) => FilteredString, { nullable: true })
    name?: string;

    @Field((_) => FilteredFloat, { nullable: true })
    price?: number;

    @Field((_) => FilteredInt, { nullable: true })
    categoryId?: number;

    @Field((_) => CategoryFilters, { nullable: true })
    category?: CategoryFilters;
}

```

`product.sort.ts`
```typescript
import { BaseSortFields, SortField } from "@merlin-gql/core";
import { Field, InputType } from "type-graphql";
import { CategorySorts } from "../category/category.sort";

@InputType()
export class ProductSorts extends BaseSortFields {
    @Field((_) => SortField, { nullable: true })
    id?: SortField;

    @Field((_) => SortField, { nullable: true })
    name?: SortField;

    @Field((_) => SortField, { nullable: true })
    price?: SortField;

    @Field((_) => SortField, { nullable: true })
    categoryId?: SortField;

    @Field((_) => CategorySorts, { nullable: true })
    category?: CategorySorts;
}
```

#### Filter and Sort Criteria Definition

By looking the filter file we can recognize the fields that we defined in our resolver generator along with the `and` and `or` fields that allow us to generate complex and flexible criteria to filter.

What if we wanted to prevent some field to be used as a filter? Well, in that case we can use another _Merlin GQL Decorator_ in our resolver generator to remove this field.

Let's say we don't want our users to be able to filter products by `categoryId`. All we need to do is decorate the `categoryId` property in the _Resolver Generator Class_ with the `@NoFilter()` decorator.

```typescript
import { MerlinGQLField, MerlinGQLResolver, NoFilter } from "@merlin-gql/core";
...

@MerlinGQLResolver([
    "ALL"
])
export class ProductResolverGenerator extends Product {

    ...

    @NoFilter()
    @MerlinGQLField((_) => ID)
    categoryId!: any;
}

```
And after a couple of seconds, _Merlin GQL_ will detect the change and regenerate the `product.filter.ts` file.

```typescript
import { BaseFilterFields, FilteredFloat, FilteredID, FilteredString } from "@merlin-gql/core";
import { Field, InputType } from "type-graphql";
import { CategoryFilters } from "../category/category.filter";

@InputType()
export class ProductFilters extends BaseFilterFields {
    
    ...

    @Field((_) => FilteredFloat, { nullable: true })
    price?: number;

    //This is where the categoryId filter used to be, its no longer there

    @Field((_) => CategoryFilters, { nullable: true })
    category?: CategoryFilters;
}

```

> _Why do we need a decorator at all? Can't we simply delete the field from the typescript code?_
Well, technically you can, but it will be __regenerated__ by the framework when it detects a change on a _Resolver Generator_. Manually changing the contents of the `_generated` folder is not a good idea since it regenerates automatically.

You can do the same with the criteria for sorting your Entities, in case you want some field to be _non sortable_ you can decorate it with the `@NoSort()` decorator and it will be removed from the sort file.

```typescript
import { MerlinGQLField, MerlinGQLResolver, NoFilter, NoSort } from "@merlin-gql/core";
...

@MerlinGQLResolver([
    "ALL"
])
export class ProductResolverGenerator extends Product {

    ...
    @NoSort()
    @NoFilter()
    @MerlinGQLField((_) => ID)
    categoryId!: any;
}

```

```typescript
...

@InputType()
export class ProductSorts extends BaseSortFields {
    
    ...

    @Field((_) => SortField, { nullable: true })
    price?: SortField;

    //This is where the categoryId sort field used to be, its no longer there

    @Field((_) => CategorySorts, { nullable: true })
    category?: CategorySorts;
}
```

### Input File

The input file, defines the fields required to _create_ and _update_ instances of our entities and store them on the database, along with defininf which fields are required according to your _TypeORM Entity_ definition.

```typescript
import { BaseInputFields } from "@merlin-gql/core";
import { Field, Float, InputType, Int } from "type-graphql";
import { Product } from "../../models/product/product.model";

@InputType()
export class ProductCreateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float)
    price: number = 0;

    @Field((_) => Int, { nullable: true })
    categoryId?: number;
}

@InputType()
export class ProductUpdateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float, { nullable: true })
    price?: number;

    @Field((_) => Int, { nullable: true })
    categoryId?: number;
}
```
> The Input Class definition is smart enough to configure itself appropiately according to the type of __primary key__ used, if your PK is auto generated, the `id` property will not be required, but it will in case you define an user created `id` value for your _TypeORM Entity_

#### Input Definition

Just like with sort, and filter criteria, there might be instances where we want to use the default values and not allowing the user to define values for a set of properties in our entities.

Let's say we don't want our users to be able to specify a product's `price` on creation.

We can decorate the `price` property in the _Resolver Generator_ class with the `@NoCreateInput()` decorator.

```typescript
import { MerlinGQLField, MerlinGQLResolver, NoCreateInput, NoFilter, NoSort } from "@merlin-gql/core";
...

@MerlinGQLResolver([
    "ALL"
])
export class ProductResolverGenerator extends Product {

    ...

    @NoCreateInput()
    @MerlinGQLField((_) => Float)
    price!: any;

    ...
}

```
And after a moment, the `product.input.ts` file will change

```typescript
...

@InputType()
export class ProductCreateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Int, { nullable: true })
    categoryId?: number;
}

@InputType()
export class ProductUpdateInput extends BaseInputFields implements Partial<Product> {
    @Field((_) => String, { nullable: true })
    name?: string;

    @Field((_) => Float, { nullable: true })
    price?: number;

    @Field((_) => Int, { nullable: true })
    categoryId?: number;
}

```

If for some reason we don't want the user to be able to update the price value, we could also use the `@NoUpdateInput()` decorator, or as in this case we don't want the user to be able to define `price` on __creation nor update__ we can use the `NoInput()` decorator to block both.
