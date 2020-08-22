const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  const secret = config.get("secretKey");
  return jwt.sign(
    { id: user.id, email: user.email, userName: user.userName },
    secret,
    { expiresIn: "100h" }
  );
};
