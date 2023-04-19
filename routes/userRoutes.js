const express = require("express");
const userController = require("../controllers/userController");

//initialize the router
const router = express.Router();

//Defining routes for the /api/users endpoint
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

//Export router
module.exports = (db) => {
  userController.setDb(db);
  return router;
};
