const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

//initialize the router
const router = express.Router();

//Defining routes for the /api/users endpoint
router.get("/", [auth, isAdmin], userController.getAllUsers);
router.get("/:id", [auth, isAdmin], userController.getUserById);
router.post("/", [auth, isAdmin], userController.createUser);
router.post("/auth", userController.authenticateUser);
router.put("/:id", [auth, isAdmin], userController.updateUser);
router.delete("/:id", [auth, isAdmin], userController.deleteUser);

//Export router
module.exports = (db) => {
  userController.setDb(db);
  return router;
};
