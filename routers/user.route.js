const express = require("express");
const userRoute = express.Router();
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../utils/redis");
const { auth } = require("../middleware/validation");
const { logger } = require("../utils/logger");

userRoute.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).send("user already exists");
    }

    bcrypt.hash(password, 2, async (err, hash) => {
      const newUser = new UserModel({ name, email, password: hash, city });
      await newUser.save();
      res.status(200).send("user created");
    });
  } catch (error) {
    logger.error({ message: error });
    res.status(400).send("Internal error");
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).send("Unauthorized user");
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        res.status(400).send("Unauthorized user");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.send(token);
      res.status(200).send("logged in succesfully");
    });
  } catch (error) {
    logger.error({ message: error });
    res.status(400).send("Internal error");
  }
});

userRoute.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    await redisClient.sAdd(userId, token);
    res.status(200).send(" blacklisted");
  } catch (error) {
    logger.error({ message: error });
    res.status(400).send("Internal error");
  }
});

module.exports = { userRoute };
