const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  city: {
    type: String,
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
