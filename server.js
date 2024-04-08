require("dotenv").config();
const path = require("path");

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const songRoutes = require("./routes/songs");
const userRoutes = require("./routes/user");
const documentRoutes = require("./routes/documents");
const recordingRoutes = require("./routes/recordings");

//run express app
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("public")));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/documents", documentRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recordings", recordingRoutes);

//serve front-end
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to the database");
      console.log("listening on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

process.env;
