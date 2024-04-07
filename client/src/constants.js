// Constants.js
const production = {
  url: "https://james-azure-test.azurewebsites.net/",
};
const development = {
  url: "http://localhost:4000",
};
export const config =
  process.env.NODE_ENV === "development" ? development : production;
