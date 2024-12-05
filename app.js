require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const movieRoutes = require("./routes/movieRoutes.js");
const authRoutes = require("./routes/auth.js");
const seedAdmin = require("./scripts/seedAdmin.js");

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.send("Welcome to the movie collection");
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

app.use((req, res) => {
  res.status(404).send("Resource not found");
});
