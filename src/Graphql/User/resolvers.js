const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const User = require("../../Models/User");
const authCheck = require("../../Utils/AuthCheck");
const tokenGenerator = require("../../Utils/TokenGenerator");

module.exports = {
  Query: {
    users: async (_, args) => {
      const users = await User.find();
      return users;
    },
    user: async (_, { userId }) => {
      const user = await User.findById(userId);
      return user;
    },
    followers: async (_, { userId }) => {
      const user = await User.findById(userId);
      let followers = [];
      user.followers.forEach((item) => {
        const follower = User.findById(item);
        followers.push(follower);
      });
      return followers;
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { email, password, userName } = args;
      const userByEmail = await User.findOne({ email: email });
      const userByUserName = await User.findOne({ userName: userName });
      //validation
      if (userByEmail || userByUserName) {
        throw new UserInputError("کاربر تکراری", {
          errors: [{ path: "user", message: "این کاربر  قبلا ثبت شده است" }],
        });
      } else {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
          userName,
          email,
          password: hashed,
          createdAt: new Date().toISOString(),
        });
        const res = await newUser.save();
        const token = tokenGenerator(res);
        return token;
      }
    },
    login: async (_, { userName, password }) => {
      const user = await User.findOne({ userName });
      if (!user) {
        throw new UserInputError("کاربر نا موجود ", {
          errors: [
            { path: "user", message: "کاربری با مشخصات وارد شده یافت نشد" },
          ],
        });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw new UserInputError("رمز اشتباه ", {
            errors: [{ path: "user", message: "رمز وارد شده صحیح نمی باشد" }],
          });
        } else {
          const token = tokenGenerator(user);
          return token;
        }
      }
    },
    follow: async (_, { userId }, context) => {
      const user = authCheck(context);
      const targetUser = await User.findById(userId);
      const find = targetUser.followers.find((it) => it === user.id);
      if (find) {
        targetUser.followers = targetUser.followers.filter(
          (ite) => ite !== user.id
        );
      } else {
        targetUser.followers = [...targetUser.followers, user.id];
      }
      await targetUser.save();
      return true;
    },
    profile: async (_, args, context) => {
      const { firstName, lastName, age, image, gender } = args;
      const user = authCheck(context);
      const targetUser = await User.findById(user.id);
      targetUser.firstName = firstName ? firstName : targetUser.firstName;
      targetUser.lastName = lastName ? lastName : targetUser.lastName;
      targetUser.age = age ? parseInt(age) : targetUser.age;
      targetUser.image = image ? image : targetUser.image;
      targetUser.gender = gender ? gender : targetUser.gender;
      const res = await targetUser.save();
      return res;
    },
  },
};
