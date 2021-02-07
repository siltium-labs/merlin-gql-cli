![Logo](https://i.imgur.com/4Yf8iaI.png)

[![Version](https://img.shields.io/npm/v/merlin-gql.svg)](https://npmjs.org/package/merlin-gql)
[![Downloads/week](https://img.shields.io/npm/dw/merlin-gql.svg)](https://npmjs.org/package/merlin-gql)
[![License](https://img.shields.io/npm/l/merlin-gql.svg)](https://github.com/silentium-labs/merlin-gql/blob/master/package.json)

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
npm install --global merlin-gql
```

or it's short version

```
npm i -g merlin-gql
```

If you want to use _npx_ instead, you don't need to install Merlin GQL globally.

> From now on and through the rest of the guide, we will assume that you have the CLI installed globally, if you decided to use _npx_ then all you need to do is to prefix all the commands with `npx `.

### Starting a new project

With the CLI you can create a new project using the _new_ command

```
merlin-gql new
```

or with npx

```
npx merlin-gql new
```

Once you run the command, the CLI will guide ask you to choose a template for your project, if you are familiar with Merlin GQL you can select the **Bascic** template, which is a template with only the bare minimum files required to create your API without any example files and without boilerplate code.

As previously recommended, if this is your first time using Merlin GQL or you want to explore it's features, we recommend to select the **Example** template.

![Imgur](https://i.imgur.com/fLOu3ut.png)

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

<! --### Project Structure -->
