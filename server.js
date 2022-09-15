const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

const server = app.listen(process.env.PORT || 8000, () => {
  const port = server.address().port;
  console.log("express server is listening to port " + port);
});

// routes import
const authRoute = require("./route/auth_route");

app.use("/auth", authRoute);

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
