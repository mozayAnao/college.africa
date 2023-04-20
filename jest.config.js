// module.exports = {
//   testEnvironment: "node",
//   verbose: true,
//   testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
//   setupFiles: ["dotenv/config"],
//   globals: {
//     NODE_ENV: process.env.NODE_ENV || "test",
//     database: {
//       connection: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//       },
//     },
//   },
//   reporters: ["default"],
//   coveragePathIgnorePatterns: [
//     "/node_modules/",
//     "/src/database/",
//     "/src/types/",
//     "/src/server.js",
//     "/src/app.js",
//     "/src/index.js",
//   ],
//   collectCoverageFrom: ["src/**/*.js"],
// };

module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  globals: { PORT: process.env.PORT || "3001" },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  verbose: true,
};

// module.exports = {
//   setupFile: ["<rootDir>/.jest/setEnvVars.js"],
// };
