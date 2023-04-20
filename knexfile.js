module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "college_africa",
    },
    migrations: {
      directory: "./databse/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
};
