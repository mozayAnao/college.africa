const { User, validateUser } = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

let db;

function setDb(database) {
  db = database;
}

async function getAllUsers(req, res) {
  try {
    const users = await db("users").select();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserById(req, res) {
  const id = req.params.id;

  try {
    const user = await db("users").where({ id: id }).select().first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: `User with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, is_admin, password } = req.body;
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new User object
    const user = new User(id, name, email, is_admin, passwordHash);
    console.log(user);

    await validateUser(user);

    const [insertedId] = await db("users").insert(user);
    res.status(201).json({ id: insertedId, ...user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  const id = req.params.id;

  try {
    const user = new User(req.body);

    const result = await db("users").where({ id: id }).update(user);
    if (result) {
      res.status(200).json({ id, ...user });
    } else {
      res.status(404).json({ error: `User with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  const id = req.params.id;

  try {
    const result = await db("users").where({ id: id }).delete();
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: `User with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  setDb,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
