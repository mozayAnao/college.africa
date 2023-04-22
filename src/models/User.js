const yup = require("yup");
const jwt = require("jsonwebtoken");
const config = require("config");

class User {
  constructor(user) {
    this.user = user;
  }

  async validateUser() {
    let userSchema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      is_admin: yup.boolean().required(),
      password: yup.string().required(),
    });

    await userSchema.validate(this.user, { abortEarly: false });
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

module.exports = { User };
