import postResolvers from "./posts.js";
import userResolvers from "./users.js";
import commentResolvers from "./comments.js";

const resolvers = {
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};

export default resolvers;
