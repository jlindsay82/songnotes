// Constants.js
const production = {
  url: import.meta.env.VITE_API_URL || "",
};
const development = {
  url: "http://localhost:4000",
};
export const config =
  process.env.NODE_ENV === "development" ? development : production;
