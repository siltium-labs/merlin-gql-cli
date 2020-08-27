import { buildSchema } from "type-graphql";

export const graphqlSchema = async () =>
  await buildSchema({
    resolvers: [__dirname + "/**/resolvers/*.resolver.{ts,js}",__dirname + "/**/data-generator/data-generator.{ts,js}"],
  });
