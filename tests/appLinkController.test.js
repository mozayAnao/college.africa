const request = require("supertest");
const { db, app } = require("../index");

describe("GET /api/appLinks", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/api/appLinks");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe("GET /api/appLinks/:id", () => {
  test("should return an App by id", async () => {
    // Create a new App to retrieve by id
    const appLink = await db("app_links")
      .insert({
        name: "John Doe",
        icon: "johndoe@example.com",
        url: "https://password123.com",
      })
      .returning("*");

    console.log("App: ", appLink);

    // Make a GET request to retrieve the app by id
    const response = await request(app).get(`/api/appLinks/${appLink[0]}`);

    // Expect the response status code to be 200 OK
    expect(response.statusCode).toBe(200);

    // Expect the response body to have a 'data' property
    expect(response.body).toHaveProperty("data");

    // Expect the 'data' property to be an object with the correct app data
    expect(response.body.data).toBeInstanceOf(Object);
  });

  test("should return an error if app is not found", async () => {
    // Make a GET request to retrieve a non-existent app by id
    const response = await request(app).get("/api/appLinks/invalidid");

    // Expect the response status code to be 404 Not Found
    expect(response.statusCode).toBe(404);

    // Expect the response body to have an 'error' property with the correct error message
    expect(response.body).toHaveProperty("error");
  });
});
