const request = require("supertest");
const app = require("../../index");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const knex = require("knex");
const knexfile = require("../../knexfile");

////////////////////////////////////////////////////////////////////////Globals////////////////////////////////
let token = "";

// Connect to the test database
const db = knex(knexfile.test);
app.set("db", db);

// Create a new test file
const createTestFile = () => {
  const fileContent = "This is a test file";
  const fileName = `test-file-${uuidv4()}.png`;
  fs.writeFileSync(`public/images/${fileName}`, fileContent);

  return fileName;
};

//Deletes test file
const deleteTestFile = (fileName) => {
  fs.unlinkSync(`public/images/${fileName}`);
};

//Inserts test data
const insertTestData = async () => {
  const newApp = {
    name: "John Doe",
    icon: "johndoe@example.com",
    url: "https://password123.com",
  };

  const [appLink] = await db("app_links").insert(newApp);

  return appLink;
};

//Deletes inserted data
const deleteTestData = async (id) => {
  await db("app_links").where("id", id).delete();
};
////////////////////////////////////////////////////////////////EndGlobals////////////////////////////////

////////////////////////////////////////////////////////////////////////Tests////////////////////////////////

beforeAll(async () => {
  // Run the Knex seed command to seed the database with admin user
  const seeded = await db.seed.run({ specific: "01_admin_user.js" });

  if (seeded) {
    // Authenticate admin user to get token
    const response = await request(app)
      .post("/api/users/auth")
      .send({ email: "admin@college.africa", password: "admin" });

    token = response.body.data.token;
  }
});

afterAll(async () => {
  //Undo seed
  await db.seed.run({
    specific: "01_admin_user.js",
    directory: "./database/seeds",
    undo: true,
  });
});

//getAllApps
describe("GET /api/appLinks", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/api/appLinks");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

//getAppById
describe("GET /api/appLinks/:id", () => {
  test("should return an App by id", async () => {
    const appLink = await insertTestData();

    // Make a GET request to retrieve the app by id
    const response = await request(app).get(`/api/appLinks/${appLink}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("icon");
    expect(response.body.data).toHaveProperty("url");

    deleteTestData(appLink);
  });

  test("should return an error if app is not found", async () => {
    // Make a GET request to retrieve a non-existent app by id
    const response = await request(app).get("/api/appLinks/invalidid");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

//create App
describe("POST /api/appLinks", () => {
  test("should create a new app link and return 201", async () => {
    const fileName = createTestFile();

    const response = await request(app)
      .post("/api/appLinks")
      .set("x-auth-token", token)
      .field("name", "Test App Link")
      .field("url", "https://www.test-app-link.com")
      .attach("icon", `public/images/${fileName}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("icon");
    expect(response.body.data).toHaveProperty("url");

    deleteTestFile(fileName);
    deleteTestData(response.body.data.id);
  });
});

//updateAppLinlById
describe("PUT /api/appLinks/:id", () => {
  test("should update an App by id", async () => {
    const appLink = await insertTestData();

    const fileName = createTestFile();

    // Make a PUT request to retrieve and update the app by id
    const response = await request(app)
      .put(`/api/appLinks/${appLink}`)
      .set("x-auth-token", token)
      .field("name", "Test App Link")
      .field("url", "https://www.test-app-link.com")
      .attach("icon", `public/images/${fileName}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("icon");
    expect(response.body.data).toHaveProperty("url");

    deleteTestFile(fileName);
    deleteTestData(appLink);
  });

  test("should return an error if app is not found", async () => {
    const fileName = createTestFile();

    // Make a PUT request to retrieve and update a non-existent app by id
    const response = await request(app)
      .put("/api/appLinks/invalidid")
      .set("x-auth-token", token)
      .field("name", "Test App Link")
      .field("url", "https://www.test-app-link.com")
      .attach("icon", `public/images/${fileName}`);

    deleteTestFile(fileName);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

//deleteAppById
describe("DELETE /api/appLinks/:id", () => {
  test("should delete an App by id", async () => {
    const appLink = await insertTestData();

    // Make a PUT request to retrieve and delete the app by id
    const response = await request(app)
      .delete(`/api/appLinks/${appLink}`)
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_msg");
  });

  test("should return an error if app is not found", async () => {
    // Make a PUT request to retrieve and delete a non-existent app by id
    const response = await request(app)
      .delete("/api/appLinks/invalidid")
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
