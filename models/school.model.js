const mongoose = require("mongoose");

const schoolScheme = new mongoose.Schema({
  schoolName: {
    type: String,
    // require: true,
  },
  schoolAddress: {
    type: String,
    // required: true,
  },
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
    difault: "",
  },
  gender: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("school", schoolScheme);
