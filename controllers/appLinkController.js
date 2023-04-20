const validateResponse = require("./types");
const { AppLink, validateAppLink } = require("../models/AppLink");

let db;

function setDb(database) {
  db = database;
}

async function getAllAppLinks(req, res) {
  let response = null;

  try {
    const appLinks = await db("app_links").select();
    response = { data: appLinks };

    if (validateResponse(response)) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ error: "Invalid API response" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAppLinkById(req, res) {
  const id = req.params.id;
  let response = null;

  try {
    const appLink = await db("app_links").where({ id: id }).select().first();
    if (appLink) {
      response = { data: appLink };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        res.status(500).json({ error: "Invalid API response" });
      }
    } else {
      res.status(404).json({ error: `App Link with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createAppLink(req, res) {
  const { name, url } = req.body;
  const icon = req.file.path;
  let response = null;

  try {
    //Create new AppLink object
    const appLink = new AppLink(name, icon, url);

    //Validate user input
    await validateAppLink(appLink);

    const [insertedId] = await db("app_links").insert(appLink);

    response = {
      _msg: "App added successfully",
      data: { id: insertedId, ...appLink },
    };

    if (validateResponse(response)) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: "Invalid API response" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAppLink(req, res) {
  const id = req.params.id;
  const { name, url } = req.body;
  const icon = req.file.path;
  let response = null;

  try {
    //Create new AppLink object
    const appLink = new AppLink(name, icon, url);

    const result = await db("app_links").where({ id: id }).update(appLink);
    if (result) {
      response = {
        _msg: `App with ID ${id} updated successfully`,
        data: { id, ...appLink },
      };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        res.status(500).json({ error: "Invalid API response" });
      }
    } else {
      res.status(404).json({ error: `App Link with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAppLink(req, res) {
  const id = req.params.id;
  let response = null;

  try {
    const result = await db("app_links").where({ id: id }).delete();
    if (result) {
      response = { _msg: `App with ID ${id} deleted successfully` };

      if (validateResponse(response)) {
        res.status(200).json(response);
      } else {
        res.status(500).json({ error: "Invalid API response" });
      }
    } else {
      res.status(404).json({ error: `App Link with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  setDb,
  getAllAppLinks,
  getAppLinkById,
  createAppLink,
  updateAppLink,
  deleteAppLink,
};
