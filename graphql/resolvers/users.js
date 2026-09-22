import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import Config from "../../config.js";

const resolvers = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info,
    ) => {
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = jwt.sign(
        { id: res._id, email, username },
        Config.SECRET_KEY,
        {
          expiresIn: "1h",
        },
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

export default resolvers;
