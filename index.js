require("dotenv").config();
const express = require("express");

const { redisClient } = require("./utils/redis");
const { connection } = require("./db");
const { userRoute } = require("./routers/user.route");
const { weatherRoute } = require("./routers/weather");
const app = express();

app.use(express.json());

app.use("/user", userRoute);
app.use("/weather", weatherRoute);

app.listen(3300, async () => {
  await connection;
  await redisClient.connect();
  console.log("server started");
});
