import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express, { json, text } from "express";
import http from "http";
import path from "path";
import { initializeDatabase } from "./core/database/database";
import { getCurrentEnvironmentalConfig, isDevelopment } from "./core/env/env";
import { graphqlSchema } from "./core/graphql-schema";


const startServer = async () => {
  const app = express();
  app.use(json({ limit: "5mb" }));
  app.use(text({ limit: "5mb" }));
  app.use(cors());
  app.use(express.static(path.join(__dirname, "wwwroot")));
  const httpServer = new http.Server(app);
  const config = await getCurrentEnvironmentalConfig();
  const schema = await graphqlSchema();

  const server = new ApolloServer({
    introspection: config.enablePlayground,
    playground: config.enablePlayground,
    schema,
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {},
    },
  });

  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  const apolloGraphQLServerUrl = `localhost:${process.env.PORT || 4000}${
    server.graphqlPath
  }`;

  const PORT = +(process.env.PORT || 4000);

  httpServer.listen({ port: PORT }, async () => {
    console.log(`🚀 Server ready at http://${apolloGraphQLServerUrl}`);
    console.log(`🚀 Subscriptions ready at ws://${apolloGraphQLServerUrl}`);
  });
  return apolloGraphQLServerUrl;
};

startServer()
  .then(async (serverUrl) => {
    try {
      await initializeDatabase();
      if (isDevelopment) {
      }
    } catch (e) {
      throw e;
    }
  })
  .catch(console.log);
process.on("warning", (e) => console.warn(e.stack));
