const express = require("express");
const { auth } = require("../middleware/validation");
const weatherRoute = express.Router();
const axios = require("axios");
const { UserModel } = require("../models/user.model");
const { cityValidator } = require("../middleware/city");

weatherRoute.get("/", auth, async (req, res) => {
  try {
    const user = await UserModel.findOne(req.userId);

    if (cityValidator(user.city)) {
      const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${user.city}&limit=5&appid=9b9b71225344e376975573ed30d5fe0e`;
    }

    const response = await axios.get(URL);
    console.log(response.data);

    res.send("rendered data successfully");
  } catch (error) {
    logger.error({ message: error });
    res.status(400).send("Internal error");
  }
});

module.exports = { weatherRoute };
