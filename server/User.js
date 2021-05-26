const { Schema, model, isValidObjectId } = require("mongoose");

const User = new Schema({
  name: String,
  email: String,
  password: String,
  avatar: { type: String, default: "hsl(245,75%,65%)" },
});

module.exports = model("User", User);
