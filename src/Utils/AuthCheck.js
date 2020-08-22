const { UserInputError } = require("apollo-server");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  const secret = config.get("secretKey");
  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user = jwt.verify(token, secret);
        return user;
      } catch (error) {
        throw new UserInputError("توکن نا معتبر", {
          errors: [
            {
              path: "auth",
              message: "تاریخ توکن گذشته است لطفا دوباره وارد شوید",
            },
          ],
        });
      }
    } else {
      throw new UserInputError("توکن نا موجود", {
        errors: [{ path: "auth", message: "لطفا وارد شوید" }],
      });
    }
  } else {
    throw new UserInputError("توکن نا موجود", {
      errors: [{ path: "auth", message: "لطفا وارد شوید" }],
    });
  }
};
