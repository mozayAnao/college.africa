const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, No token provided");

  try {
    const decodedToken = jwt.verify(token, config.get("jwtSecret"));
    req.user = decodedToken;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
