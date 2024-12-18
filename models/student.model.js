const mongoose = require("mongoose");

const studentScheme = new mongoose.Schema({
  surname: {
    type: String,
    default: "",
  },
  othersName: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    default: "",
  },
  school: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("register", studentScheme);
