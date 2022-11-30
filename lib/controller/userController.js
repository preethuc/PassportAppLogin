"use strict";

var _userModel = require("./../model/userModel");

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createUser = async function (req, res, next) {
  console.log("try block");
  try {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 8;
    var randomString = "";
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(rnum, rnum + 1);
    }
    var createData = await new _userModel2.default({
      user_name: req.body.user_name,
      full_name: req.body.full_name,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      passport_number: req.body.passport_number,
      password: randomString
    });

    createData.save();

    res.status(201).json({
      status: "success",
      message: "created successfully",
      data: createData
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async function (req, res, next) {
  try {
    var getData = await _userModel2.default.find();
    res.status(200).json({
      status: "success",
      message: "ALL USERS"
      // data: getData,
    });
  } catch (error) {
    console.log(error);
  }
};