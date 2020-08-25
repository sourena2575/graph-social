const Post = require("../../Models/Post");
const AuthCheck = require("../../Utils/AuthCheck");

module.exports = {
  Query: {
    posts: async () => {
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    },
    post: async (_, { postId }) => {
      const post = await Post.findById(postId);
      return post;
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const { userName } = AuthCheck(context);
      const newPost = new Post({
        userName,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await newPost.save();
      return true;
    },
  },
};
