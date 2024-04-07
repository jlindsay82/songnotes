// Constants.js
const production = {
  url: "http://localhost:4000",
};
const development = {
  url: "http://localhost:4000",
};
export const config =
  process.env.NODE_ENV === "development" ? development : production;
