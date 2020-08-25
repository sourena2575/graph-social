const userResolvers = require("./User/resolvers");
const chatResolvers = require("./Chat/resolvers");
const postResolvers = require("./post/resolvers");
module.exports = {
  User: {
    followerCount: (parent, args) => {
      return parent.followers.length;
    },
  },
  // Post: {
  //  likeCount: (parent, args) => {
  //    return parent.likes.length;
  //  },
  //  commentCount: (parent, args) => {
  //   return parent.comments.length;
  //},
  // },
  Query: {
    ...userResolvers.Query,
    ...chatResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  Subscription: {
    ...chatResolvers.Subscription,
  },
};
