require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const https = require("https");
const WebSocket = require("ws");
const connectDB = require("./config/db.js");
const movieRoutes = require("./routes/movieRoutes.js");
const authRoutes = require("./routes/auth.js");
const seedAdmin = require("./scripts/seedAdmin.js");
const selfsigned = require("selfsigned");

const { initializeWebSocket } = require("./handler/wsHandler");

const app = express();
const PORT = 3005;
const HTTPS_PORT = 3443;
const LOCALHOST = "localhost";

const attrs = { name: "commonName", value: ` ${LOCALHOST}` };
const options = { days: 365 };
const { private: privateKey, cert: certificate } = selfsigned.generate(
  attrs,
  options
);

const sslOptions = {
  key: privateKey,
  cert: certificate,
};

const server = https.createServer(sslOptions, app);

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) =>
  res.send("Welcome to the student management system over HTTPS!")
);

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
  server.listen(HTTPS_PORT, () => {
    console.log(`Server is running on ${LOCALHOST}:${HTTPS_PORT}`);
  });

  startWsServer(server);
};

startServer();

app.use((req, res) => {
  res.status(404).send("Resource not found");
});
