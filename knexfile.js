const config = require("config");

module.exports = {
  development: {
    client: config.get("database").client,
    connection: config.get("database").connection,
    migrations: {
      directory: "./databse/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
  test: {
    client: config.get("database").client,
    connection: config.get("database").connection,
    migrations: {
      directory: "./databse/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
};
