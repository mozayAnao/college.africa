const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const config = require("config");
const knex = require("knex")(config.get("database"));
const userRoutes = require("./src/routes/userRoutes");
const appLinkRoutes = require("./src/routes/appLinkRoutes");

//Initialize Epress
const app = express();

//Exit is JWT Secret key is not set
if (!config.get("jwtSecret")) {
  console.error("FATAL ERROR: jwtSecret is not defined");
  process.exit(1);
}

app.use(helmet());
app.use(cors());

//Setup the body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to the database
const db = knex;

//API routes
app.use("/api/users", userRoutes(db));
app.use("/api/appLinks", appLinkRoutes(db));

//Start server
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
