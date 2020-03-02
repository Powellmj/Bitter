const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLNonNull } = graphql;
const mongoose = require("mongoose");
const UserType = require("./types/user_type")
require("../../models/index");
const User = mongoose.model("users");
const AuthService = require("../services/Auth");
const { singleFileUpload } = require("../services/s3");
const { GraphQLUpload } = require('graphql-upload');


const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: {type: GraphQLString},
        fullname: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    logout: {
    type: UserType,
    args: {
      // all we need to log the user our is an id
      _id: { type: GraphQLID }
    },
    resolve(_, args) {
      return AuthService.logout(args);
    }
  },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        fullname: {type: GraphQLString},      
        email: { type: GraphQLString },
        bio: { type: GraphQLString },
        image: { type: GraphQLUpload}
      },
      async resolve(_parentvalue, { id, username, fullname, email, bio, image }) {
        const updateObj = {};

        if (id) updateObj.id = id;
        if (username) updateObj.username = username;
        if (fullname) updateObj.fullname = fullname;
        if (email) updateObj.email = email;
        if (bio) updateObj.bio = bio;
        if (image) {
          updateObj.image = await singleFileUpload(image);
        }

        return User.findOneAndUpdate(
          { _id: id },
          { $set: updateObj },
          { new: true },
          (err, user) => {
            return user;
          }
        );
      }
    },
  }
});

module.exports = mutation;