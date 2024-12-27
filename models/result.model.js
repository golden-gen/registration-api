const { Result } = require("express-validator");
const mongoose = require("mongoose");

const resultScheme = new mongoose.Schema({
  userId: {
    type: String,
    // require: true,
  },
  result: {
    type: String,
    // require: true,
  },
});
module.exports = mongoose.model("result", resultScheme);
