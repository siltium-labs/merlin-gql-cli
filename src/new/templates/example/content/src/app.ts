import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express, { json, Request, text } from "express";
import http from "http";
import { GqlContext } from "merlin-gql";
import path from "path";
import { initializeDatabase } from "./core/database/database";
import { getCurrentEnvironmentalConfig, isDevelopment } from "./core/env/env";
import { graphqlSchema } from "./core/graphql-schema";
import { SecurityFunctions } from "./core/security/security.functions";

const startServer = async () => {
  const app = express();
  app.use(json({ limit: "5mb" }));
  app.use(text({ limit: "5mb" }));
  app.use(cors());
  app.use(express.static(path.join(__dirname, "wwwroot")));
  const httpServer = new http.Server(app);
  const config = await getCurrentEnvironmentalConfig();
  const schema = await graphqlSchema();

  const createContext = async (token?: string) => {
    if (token) {
      const user = await SecurityFunctions.decodeToken(
        token.replace("Bearer ", "")
      );
      return new GqlContext(user);
    }
  };
  
  const server = new ApolloServer({
    introspection: config.enablePlayground,
    playground: config.enablePlayground,
    schema,
    context: async ({ req }: { req: Request }) => {
      const token = req?.headers?.authorization;
      return createContext(token);
    },
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        return createContext(
          (connectionParams as { authorization: string }).authorization
        );
      },
    },
  });

  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  const apolloGraphQLServerUrl = `localhost:${process.env.PORT || 4001}${
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
