const app = require("../index");
const knex = require("knex");
const knexfile = require("../knexfile");
const { authenticateUser } = require("../src/controllers/userController");

// Connect to the test database
const db = knex(knexfile.test);
app.set("db", db);

beforeAll(async () => {
  // Run the Knex seed command to seed the database with admin user
  await db.seed.run({ specific: "01_admin_user.js" });
});

afterAll(async () => {
  //Undo seed
  await db.seed.run({
    specific: "01_admin_user.js",
    directory: "./database/seeds",
    undo: true,
  });
});

describe("authenticateUser controller", () => {
  it("should return a user object if valid email and password are provided", () => {
    const mockRequest = {
      body: {
        email: "admin@college.africa",
        password: "admin",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const mockNext = jest.fn();

    return authenticateUser(mockRequest, mockResponse, mockNext).then(() => {
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  it("should call next with an error if invalid email or password are provided", () => {
    const mockRequest = {
      body: {
        email: "test@example.com",
        password: "invalidpassword",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    return authenticateUser(mockRequest, mockResponse).then(() => {
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
