const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");
const userRoutes = require("./routes/userRoutes");
const appLinkRoutes = require("./routes/appLinkRoutes");

//Initialize Epress
const app = express();

//Setup the body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to the database
const db = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "college_africa",
  },
});

//API routes
app.use("/api/users", userRoutes(db));
app.use("/api/appLinks", appLinkRoutes(db));

//Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
