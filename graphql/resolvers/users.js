import { UserInputError } from "apollo-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Config from "../../config.js";
import { User } from "../../models/User.js";
import { validateRegisterInput } from "../../util/validators.js";

const resolvers = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } },
    ) => {
      // Validate user input
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Check if username already exists
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is already taken",
          },
        });
      }

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
