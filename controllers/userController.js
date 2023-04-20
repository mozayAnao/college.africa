const { User, validateUser } = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const validateResponse = require("./types");

let db;

function setDb(database) {
  db = database;
}

async function getAllUsers(req, res) {
  let response = null;
  try {
    const users = await db("users").select();

    response = { data: users };

    if (validateResponse(response)) {
      res.status(200).json(response);
    } else {
      return res.status(500).json({ error: "Invalid API response" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserById(req, res) {
  const id = req.params.id;
  let response = null;

  try {
    const user = await db("users").where({ id: id }).select().first();
    if (user) {
      response = { data: user };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        return res.status(500).json({ error: "Invalid API response" });
      }
    } else {
      res.status(404).json({ error: `User with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  const { name, email, is_admin, password } = req.body;
  let response = null;

  let result = await db("users").where({ email: email }).select().first();
  if (result)
    return res.status(400).json({ error: "This user already exists" });

  try {
    //Generate user id
    const id = uuidv4();

    //Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new User object
    const user = new User(id, name, email, is_admin, passwordHash);
    console.log(user);

    //Validate user input
    await validateUser(user);

    const [insertedId] = await db("users").insert(user);

    response = {
      _msg: "User added successfully",
      data: { id: insertedId, ...user },
    };
    if (validateResponse(response)) {
      res.status(201).json(response);
    } else {
      return res.status(500).json({ error: "Invalid API response" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function authenticateUser(req, res) {
  let response = null;

  try {
    const { email, password } = req.body;

    //Create new User object
    const user = new User();

    //Check if the user exists
    let result = await db("users").where({ email: email }).select().first();
    if (!result)
      return res.status(400).json({ error: "Invalid username or password" });

    //Check of passwords match
    const validPassword = await bcrypt.compare(password, result.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid username or password" });

    //Generate Jsonwebtoken
    const token = user.generateAuthToken(result);

    response = { data: { token: token } };

    if (validateResponse(response)) {
      res.status(200).json(response);
    } else {
      return res.status(500).json({ error: "Invalid API response" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  const id = req.params.id;
  let response = null;

  try {
    const user = new User(req.body);

    const result = await db("users").where({ id: id }).update(user);
    if (result) {
      response = { _msg: "User updated successfully", data: { id, ...user } };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        return res.status(500).json({ error: "Invalid API response" });
      }
    } else {
      res.status(404).json({ error: `User with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  const id = req.params.id;
  let response = null;

  try {
    const result = await db("users").where({ id: id }).delete();
    if (result) {
      response = { _msg: "User deleted Successfully" };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        return res.status(500).json({ error: "Invalid API response" });
      }
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
  authenticateUser,
  updateUser,
  deleteUser,
};
