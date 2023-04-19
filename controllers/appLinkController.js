const { AppLink, validateAppLink } = require("../models/AppLink");

let db;

function setDb(database) {
  db = database;
}

async function getAllAppLinks(req, res) {
  try {
    const appLinks = await db("app_links").select();
    res.status(200).json(appLinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAppLinkById(req, res) {
  const id = req.params.id;

  try {
    const appLink = await db("app_links").where({ id: id }).select().first();
    if (appLink) {
      res.status(200).json(appLink);
    } else {
      res.status(404).json({ error: `App Link with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createAppLink(req, res) {
  try {
    const { name, icon, url } = req.body;

    //Create new AppLink object
    const appLink = new AppLink(name, icon, url);
    console.log(appLink);

    await validateAppLink(appLink);

    const [insertedId] = await db("app_links").insert(appLink);
    res.status(201).json({ id: insertedId, ...appLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAppLink(req, res) {
  const id = req.params.id;

  try {
    const { name, icon, url } = req.body;

    //Create new AppLink object
    const appLink = new AppLink(name, icon, url);

    const result = await db("app_links").where({ id: id }).update(appLink);
    if (result) {
      res.status(200).json({ id, ...appLink });
    } else {
      res.status(404).json({ error: `App Link with ID ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAppLink(req, res) {
  const id = req.params.id;

  try {
    const result = await db("app_links").where({ id: id }).delete();
    if (result) {
      res.status(204).send();
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
