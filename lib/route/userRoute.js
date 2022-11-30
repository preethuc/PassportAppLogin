"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _userController = require("../controller/userController");

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/userCreate", _userController2.default.createUser);
router.get("/allUser", _userController2.default.getUser);

module.exports = router;