const request = require("supertest");
const app = require("../../index");
const knex = require("knex");
const knexfile = require("../../knexfile");

////////////////////////////////////////////////////////////////////////Globals////////////////////////////////
let token = "";

// Connect to the test database
const db = knex(knexfile.test);
app.set("db", db);

//Inserts test data
const insertTestData = async () => {
  const newApp = {
    id: "test001",
    name: "John Doe",
    email: "johndoe@example.com",
    is_admin: true,
    password: "password123",
  };

  await db("users").insert(newApp);

  return newApp.id;
};

//Deletes inserted data
const deleteTestData = async (id) => {
  await db("users").where("id", id).delete();
};

//Test user form data
const newUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  is_admin: true,
  password: "password123",
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

//getAllUsers
describe("GET /api/users", () => {
  test("should return 200", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("x-auth-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

//getUserById
describe("GET /api/users/:id", () => {
  test("should return an User by id", async () => {
    const userId = await insertTestData();

    // Make a GET request to retrieve the user by id
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("is_admin");

    deleteTestData(userId);
  });

  test("should return an error if user is not found", async () => {
    // Make a GET request to retrieve a non-existent user by id
    const response = await request(app)
      .get("/api/users/invalidid")
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

//create User
describe("POST /api/users", () => {
  test("should create a new user link and return 201", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("x-auth-token", token)
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("is_admin");

    deleteTestData(response.body.data.id);
  });
});

//updateUserLinlById
describe("PUT /api/users/:id", () => {
  test("should update an User by id", async () => {
    const userId = await insertTestData();

    // Make a PUT request to retrieve and update the user by id
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set("x-auth-token", token)
      .send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("is_admin");

    deleteTestData(userId);
  });

  test("should return an error if user is not found", async () => {
    // Make a PUT request to retrieve and update a non-existent user by id
    const response = await request(app)
      .put("/api/users/invalidid")
      .set("x-auth-token", token)
      .send(newUser);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

//deleteUserById
describe("DELETE /api/users/:id", () => {
  test("should delete an User by id", async () => {
    const userId = await insertTestData();

    // Make a PUT request to retrieve and delete the user by id
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_msg");

    // deleteTestData(userId);
  });

  test("should return an error if user is not found", async () => {
    // Make a PUT request to retrieve and update a non-existent user by id
    const response = await request(app)
      .delete("/api/users/invalidid")
      .set("x-auth-token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
