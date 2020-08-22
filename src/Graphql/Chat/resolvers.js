const { withFilter, PubSub } = require("apollo-server");
const Chat = require("../../Models/Chat");
const authCheck = require("../../Utils/AuthCheck");
const pubsub = new PubSub();

module.exports = {
  Query: {
    chats: async (_, args) => {
      const chats = await Chat.find();
      return chats;
    },
  },
  Mutation: {
    sendChat: async (_, { message, channelId }, context) => {
      const user = authCheck(context);
      const newChat = new Chat({
        userName: user.userName,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const res = await newChat.save();
      pubsub.publish("CHAT_SENT", {
        newChat: res,
        channelId,
      });
      return res;
    },
  },
  Subscription: {
    newChat: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("CHAT_SENT"),
        (payload, args) => {
          return payload.channelId === args.channelId;
        }
      ),
    },
  },
};
