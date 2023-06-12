const redis = require("redis");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("connected to redis");
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = { redisClient };
