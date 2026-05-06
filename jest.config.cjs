module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],

  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
};