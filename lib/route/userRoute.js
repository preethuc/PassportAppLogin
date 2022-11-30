"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _userController = require("../controller/userController");

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route("/").post(_userController2.default.createUser);
router.route("/validate").get(_userController2.default.validateUser);
router.route("/all").get(_userController2.default.getUser);
router.route("/check").post(_userController2.default.adminPassportCheck);
router.route("/login").post(_userController2.default.userLogin);
router.route("/authPass/:id").post(_userController2.default.authPasswordCron);
router.route('/myPass').patch(_userController2.default.createPermanentPassword);

module.exports = router;