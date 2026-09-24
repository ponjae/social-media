import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import CONFIG from "./config.js";
import typeDefs from "./graphql/typedefs.js";
import resolvers from "./graphql/resolvers/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(CONFIG.MONGO_DB)
  .then(() => {
    console.log("Connected to DB");
    return server.listen({ port: 5000 });
  })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
