const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const config = require("config");
const knex = require("knex")(config.get("database"));

exports.seed = async function (knex) {
  // Delete all existing users
  await knex("users").del();

  // Generate a password hash for the admin user
  const passwordHash = await bcrypt.hash(config.get("adminPassword"), 10);

  // Insert the admin user into the users table
  await knex("users").insert({
    id: uuidv4(),
    name: config.get("adminName"),
    email: config.get("adminEmail"),
    password: passwordHash,
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
  });
};
