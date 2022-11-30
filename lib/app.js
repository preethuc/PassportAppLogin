"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _userRoute = require("../src/route/userRoute");

var _userRoute2 = _interopRequireDefault(_userRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


app.use((0, _morgan2.default)("dev"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  console.log("Middleware Working");
});

app.use("/api/user", _userRoute2.default);
module.exports = app;