"use strict";

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect("mongodb://localhost:27017/passport-data");
var db = _mongoose2.default.connection;
db.on('error', function (err) {
     console.log(err);
});
db.once("open", function () {
     console.log("db connected");
});
var PORT = process.env.PORT || 3000;
_app2.default.listen(PORT, function () {
     console.log("server running on the port " + PORT);
});