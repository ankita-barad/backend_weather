const jwt = require("jsonwebtoken");
const { redisClient } = require("../utils/redis");

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  console.log(token);
  if (!token) {
    res.status(200).send("unauthorized access");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    res.status(200).send("unauthorized access");
  }

  console.log(decodedToken);
  const { userId } = decodedToken;

  const IsTokenBlacklisted = await redisClient.sIsMember(userId);
  if (IsTokenBlacklisted) {
    res.status(200).send("unauthorized access");
  }

  req.userId = userId;
  next();
};

module.exports = { auth };
