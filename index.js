const path = require("path");
const express = require("express");
const morgan = require("morgan");

const port = 4000;
const route = require("./router");
const db = require("./config/db");
const methodOverride = require("method-override");
// const Middleware = require('./middleware/Middleware')
const cors = require("cors");
var bodyParser = require("body-parser");

const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./socket-io/socket");

// Connect DB
db.connect();
const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app.use(Middleware)
// HTTP logger
app.use(morgan("combined"));
// Template engine

route(app);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
