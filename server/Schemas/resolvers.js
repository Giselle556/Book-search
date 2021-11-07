const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    newUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!profile) {
        throw new AuthenticationError("No profile with this email found!");
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    save: async (parent, { bookData }, context) => {
      if (context.user) {
        const save = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return save;
      }
      throw new AuthenticationError("log in");
    },

    remove: async (parent, { bookId }, context) => {
      if (context.user) {
        const deleted = await User.findByIdAndDelete(
          { _id: context.user._id },
          { $push: { savedBooks: { bookId } } },
          { new: true }
        );

        return deleted;
      }
      throw new AuthenticationError("log in");
    },
  },
};

module.exports = resolvers;