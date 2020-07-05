const express = require("express");
const morgan = require("morgan");

const branchRouter = require("./routes/branchRoutes");
const userRouter = require("./routes/userRoutes");
const questionbankRouter = require("./routes/questionRoutes");;
const app = express();


console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan.apply("dev"));
}
app.use(morgan("dev"));
app.use(express.json());


//app.use("/api/v1/users", userRouter);
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/questiones", questionbankRouter);
module.exports = app;
