"use strict";

var _userModel = require("./../model/userModel");

var _userModel2 = _interopRequireDefault(_userModel);

var _nodeCron = require("node-cron");

var _nodeCron2 = _interopRequireDefault(_nodeCron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//POST - create User (random password)
exports.createUser = async function (req, res, next) {
  try {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = "";
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    var createData = await new _userModel2.default({
      user_name: req.body.user_name,
      full_name: req.body.full_name,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      passport_number: req.body.passport_number,
      passport_file: req.body.passport_file,
      password: randomstring
    });

    createData.save();

    return res.status(201).json({
      status: "success",
      message: "created successfully",
      data: createData
    });
  } catch (error) {
    console.log(error);
  }
};

// GET - All User
exports.getUser = async function (req, res, next) {
  try {
    var getData = await _userModel2.default.find();
    return res.status(200).json({
      status: "success",
      message: "ALL USERS",
      result: getData.length,
      data: getData
    });
  } catch (error) {
    console.log(error);
  }
};

//GET - User is Registered or not
exports.validateUser = async function (req, res) {
  // console.log(req.query.user_name );
  var user = await _userModel2.default.findOne({ user_name: req.query.user_name });
  if (user) {
    return res.status(200).json({
      message: "User has already registered, Please Login",
      userData: user
    });
  } else {
    return res.status(200).json({
      message: "This name is not registered , Please Register the User"
    });
  }
};
//Check Admin or not And Admin - Passport verification
exports.adminPassportCheck = async function (req, res) {
  try {

    if (req.body.adminCheck) {
      if (req.body.accept) {
        return res.status(200).json({
          status: "Success",
          message: "Your passport has been verified"
        });
      } else if (req.body.reject === "rejected") {
        var user = await _userModel2.default.findById(req.body.id);
        var rejectionCount = user.no_of_rejection;
        rejectionCount.push(req.body.reject);

        var updateData = await _userModel2.default.findByIdAndUpdate(req.body.id, { login_reject: "reject", no_of_rejection: rejectionCount }, { new: true });
        console.log(updateData);

        if (updateData.no_of_rejection.length === 2) {
          res.status(400).json({
            message: "banned for 3 months"
          });
          three_months_ban();
        }

        if (updateData.no_of_rejection.length === 3) {
          res.status(400).json({
            message: "banned for 6 months"
          });
          six_months_ban();
        }

        if (updateData.no_of_rejection.length === 4) {
          twelve_months_ban();
          return res.status(400).json({
            message: "banned for 12 months"
          });
        }

        if (updateData.no_of_rejection.length >= 5) {
          var banUser = await _userModel2.default.findByIdAndUpdate(req.body.id, { permanent_ban: true }, { new: true });
          return res.status(400).json({
            message: "permanent ban "
          });
        }
        res.status(400).json({
          message: "User Rejected",
          status: "rejected"
        });
      }
    } else {
      res.send("not an admin");
    }
  } catch (error) {
    res.send(error);
  }
};
//CRON Job - Ban function
exports.three_months_ban = async function (req) {
  _nodeCron2.default.schedule("    /3 * ", async function () {
    var id = req.body.id;
    var updates = { logginReject: "accept" };
    var options = { new: true };
    var updateData = await _userModel2.default.findByIdAndUpdate(id, updates, options);
  });
};

exports.six_months_ban = async function (req) {
  _nodeCron2.default.schedule("    /6 * ", async function () {
    var id = req.body.id;
    var updates = { logginReject: "accept" };
    var options = { new: true };
    var updateData = await _userModel2.default.findByIdAndUpdate(id, updates, options);
  });
};

exports.twelve_months_ban = async function (req) {
  _nodeCron2.default.schedule("    /12 * ", async function () {
    var id = req.body.id;
    var updates = { logginReject: "accept" };
    var options = { new: true };
    var updateData = await _userModel2.default.findByIdAndUpdate(id, updates, options);
  });
};
//Auth app code - random password for every 1 min
var authPassword = async function authPassword(req) {

  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var string_length = 8;
  var randomstring = '';
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  var updateData = await _userModel2.default.findByIdAndUpdate(req.params.id, { password: randomstring }, { new: true });
};
//Auth app password with Cron
exports.authPasswordCron = async function (req, res) {
  try {

    _nodeCron2.default.schedule(" */1 * * * *", function () {
      authPassword(req);
    });

    var user = await _userModel2.default.findById(req.params.id);
    res.status(200).json({
      message: " " + user.password + " - auth app code for 1 minute"
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// POST - Login
exports.userLogin = async function (req, res) {
  try {
    var user = await _userModel2.default.findOne({ user_name: req.body.user_name });

    if (user) {
      var userPasswords = user.password;
      var checkPassword = userPasswords.includes(req.body.password);
      if (checkPassword) {
        res.status(200).json({
          status: "success",
          message: "Successfully logged in"
        });
      } else {
        return res.send("Invalid, Please enter a valid Name and password");
      }
    } else {
      res.send("Invalid, Please enter a valid Name and password");
    }
  } catch (error) {
    res.send(error);
  }
};

//Permanent password for accepted user
exports.createPermanentPassword = async function (req, res) {
  try {
    var user = await _userModel2.default.findOne({ _id: req.body.id });
    if (user.login_reject === "reject") {
      res.status(200).json({
        message: "sorry you're not eligible to create permanent password"
      });
    } else {

      var updateData = await _userModel2.default.findByIdAndUpdate(req.body.id, { password: req.body.ownPassword }, { new: true });
      res.status(200).json({
        status: "success",
        message: "Your permanent password was Created",
        Data: {
          user_name: updateData.user_name,
          password: updateData.password

        }
      });
    }
  } catch (error) {
    res.send(error.message);
  }
};