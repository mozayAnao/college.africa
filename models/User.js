const yup = require("yup");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  is_admin: yup.boolean().required(),
  password: yup.string().required(),
});

class User {
  constructor(id, name, email, is_admin, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.is_admin = is_admin;
    this.password = password;
  }
}

User.prototype.generateAuthToken = function (user) {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
    },
    config.get("jwtSecret"),
    { expiresIn: "1h" }
  );
  return token;
};

function validateUser(user) {
  return userSchema.validate(user);
}

module.exports = { User, validateUser };
