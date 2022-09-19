const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
// const io = require("socket.io");
require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

io.on("connection", (socket) => {
  console.log("connected on", socket.id);
  socket.on("create-room", (e) => {
    socket.join(e, () => {
      socket.emmit("next");
    });
  });
});

server.listen(process.env.PORT || 8000, () => {
  const port = server.address().port;
  console.log("express server is listening to port " + port);
});

//socket io server

// routes import
const authRoute = require("./route/auth_route");
const questionRoute = require("./route/question_route");
const quizRoute = require("./route/quiz_route");

app.use("/auth", authRoute);
app.use("/question", questionRoute);
app.use("/quiz", quizRoute);

// write middleware
// to do: implement later

function authenticaitonMiddleWare(req, res, next) {
  let authHeader = req.headers["authorization"];

  if (authHeader === undefined) {
    return res.status(400).send(`ERROR : No Token was provided`);
  }

  const getToken = authHeader.split(" ")[1];

  if (getToken === undefined) {
    return res.status(400).send(`ERROR : proper token was not provided`);
  }

  try {
    const payload = jwt.verify(getToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {}
}
