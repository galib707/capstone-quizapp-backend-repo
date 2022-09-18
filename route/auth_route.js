const express = require("express");
const router = express.Router();

//##################################################
//userModel import
const UserModel = require("../models/userModel");
// bcryptjs import
const bcrypt = require("bcryptjs");
// jsonwebtoken import
const jwt = require("jsonwebtoken");
//##################################################

//##################################################
// signup routes
router.post("/signup", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  // condition to check whether all fields are filed or not
  if (!name || !email || !password) {
    return res.status(401).send("All fields are required ");
  }

  // to check password and confirm password
  // if (password !== confirm_password) {
  //   return res.status(401).send("password and confirm password did not match");
  // }

  let isUserEmailAlreadyExist = await UserModel.findOne({ email: email });

  console.log(isUserEmailAlreadyExist);
  //if user exist then send a message
  if (isUserEmailAlreadyExist !== null) {
    return res.status(401).send("email already exist in the database");
  }

  //decalre salt for bcrypt to use it to made hash
  const saltMeasure = 10;
  const salt = await bcrypt.genSalt(saltMeasure);
  const hash = await bcrypt.hash(password, salt);

  let newUser = new UserModel({
    name,
    email,
    password: hash,
  });

  try {
    let saveNewUser = await newUser.save();
    console.log(saveNewUser);
    return res
      .status(200)
      .send(`Account has been created Succesfully with id ${saveNewUser._id}`);
  } catch (error) {
    return res.status(400).send(`ERROR : ${error}`);
  }
});

//##################################################
// signin routes

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // condition to check whether all fields are filed or not
  if (!email || !password) {
    return res.status(401).send("All fields are required ");
  }

  let existingUser = await UserModel.findOne({ email: email }).populate({
    path: "quizzes",
  });

  console.log(existingUser);
  // if email does not exist let the user know that
  if (existingUser === null) {
    return res
      .status(401)
      .send("Email does not exist, please try singnup if you are new user");
  } else {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    // console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).send("invalid password");
    }

    // generate rfresh token and access token
    const { _id, name, email, quizzes } = existingUser;
    console.log(existingUser);
    let user_data = { _id, name, email, quizzes };

    const access_token = jwt.sign(user_data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refresh_token = jwt.sign(
      user_data,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
      }
    );

    return res.status(200).json({ access_token, refresh_token, user_data });
  }
});

//##################################################
// signin routes

router.post("/token", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).send("Refresh token needed");
  }
  try {
    const payload = await jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    delete payload.exp;
    const access_token = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({ access_token });
  } catch (error) {
    return res.status(400).send(`ERROR: ${error}`);
  }
});

module.exports = router;
