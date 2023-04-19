const express = require("express");
const appLinkController = require("../controllers/appLinkController");

//initialize the router
const router = express.Router();

//Defining routes for the /api/appLinks endpoint
router.get("/", appLinkController.getAllAppLinks);
router.get("/:id", appLinkController.getAppLinkById);
router.post("/", appLinkController.createAppLink);
router.put("/:id", appLinkController.updateAppLink);
router.delete("/:id", appLinkController.deleteAppLink);

//Export router
module.exports = (db) => {
  appLinkController.setDb(db);
  return router;
};
