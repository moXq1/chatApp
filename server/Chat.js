const { Schema, model, isValidObjectId } = require("mongoose");

const Chat = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("Chat", Chat);
