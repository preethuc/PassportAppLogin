"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose2.default.Schema({
  user_name: {
    type: String
  },
  full_name: {
    type: String
  },
  passport_number: {
    type: String
  },
  gender: {
    type: String
  },
  date_of_birth: {
    type: String
  }

  // passport_file: {
  //   type: String,
  // },

});
var User = _mongoose2.default.model("User", userSchema);

module.exports = User;