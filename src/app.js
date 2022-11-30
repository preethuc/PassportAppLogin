import express from "express";
const app = express();
import morgan from "morgan";
import bodyParser from "body-parser";

import userRoute from "./route/userRoute";

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Middleware Working");
    next()
});

app.use("/api/user/", userRoute);

module.exports = app;
