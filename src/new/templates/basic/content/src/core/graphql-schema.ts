import { loadOtFiles } from "@merlin-gql/core";
import { buildSchema } from "type-graphql";

export const graphqlSchema = async () => {
  await loadOtFiles();
  return await buildSchema({
    resolvers: [
      __dirname + "/../**/*.resolver.{ts,js}"
    ],
    emitSchemaFile: {
      path: __dirname + "/../../schema.gql",
      commentDescriptions: true,
      sortedSchema: false, // by default the printed schema is sorted alphabetically
    },
  });
};
