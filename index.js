import { ApolloServer } from "apollo-server";
import gql from "graphql-tag";
import mongoose from "mongoose";
import { CONFIG } from "./config.js";

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!!!",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(CONFIG.MONGO_DB)
  .then(() => {
    console.log("Connected to DB");
    return server.listen({ port: 5000 });
  })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
