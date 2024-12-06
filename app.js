require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");
const connectDB = require("./config/db.js");
const movieRoutes = require("./routes/movieRoutes.js");
const authRoutes = require("./routes/auth.js");
const seedAdmin = require("./scripts/seedAdmin.js");

const { initializeWebSocket } = require("./handler/wsHandler");

const app = express();
const PORT = 3005;
const LOCAL_URL = "http://localhost";

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// HTTP Server
const server = http.createServer(app);

// Routes
app.get("/", async (req, res) => {
  res.send("Welcome to the movie collection");
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

// WebSocket Server Initialization
const startWsServer = (server) => {
  const wsServer = new WebSocket.Server({ server });
  initializeWebSocket(wsServer);
};

// Database Connection and Server Start
const startServer = async () => {
  await connectDB();
  await seedAdmin();

  // Start the combined HTTP + WebSocket server
  server.listen(PORT, () => {
    console.log(`Server is running on ${LOCAL_URL}:${PORT}`);
  });

  startWsServer(server);
};

startServer();

app.use((req, res) => {
  res.status(404).send("Resource not found");
});
