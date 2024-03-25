module.exports = {
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>"], // Assuming your server files are located in the 'server' directory
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transform: {
    "^.+\\.js$": "babel-jest", // This line specifies that Jest should use Babel to transform JavaScript files
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // This line specifies that Jest should treat the '@' symbol as the root directory
  },
};