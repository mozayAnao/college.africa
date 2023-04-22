const express = require("express");
const upload = require("../middleware/multer");
const appLinkController = require("../controllers/appLinkController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

//initialize the router
const router = express.Router();

//Defining routes for the /api/appLinks endpoint
router.get("/", appLinkController.getAllAppLinks);
router.get("/:id", appLinkController.getAppLinkById);
router.post(
  "/",
  [auth, isAdmin, upload.single("icon")],
  appLinkController.createAppLink
);
router.put(
  "/:id",
  [auth, isAdmin, upload.single("icon")],
  appLinkController.updateAppLink
);
router.delete("/:id", [auth, isAdmin], appLinkController.deleteAppLink);

//Export router
module.exports = (db) => {
  appLinkController.setDb(db);
  return router;
};
