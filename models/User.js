const yup = require("yup");

const userSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

function validateUser(user) {
  return userSchema.validate(user);
}

module.exports = { User, validateUser };
