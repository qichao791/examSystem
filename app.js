const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser')


const departRouter = require("./routes/departRoutes");
const branchRouter = require("./routes/branchRoutes");
const userRouter = require("./routes/userRoutes");
const paperRouter = require("./routes/paperRoutes");
const questionbankRouter = require("./routes/questionbankRoutes");
const subpublicbankRouter = require("./routes/subpublicbankRoutes");
const professionalbankRouter = require("./routes/professionalbankRoutes");
const userpaperRouter = require("./routes/userpaperRoutes");
const adminRouter = require("./routes/adminRoutes");


const app = express();


console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan.apply("dev"));
}
app.use(morgan("dev"));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/departs", departRouter);
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/publicquestion", questionbankRouter);
app.use("/api/v1/subpublicquestion", subpublicbankRouter);
app.use("/api/v1/professionalquestion", professionalbankRouter);
app.use("/api/v1/userpaper", userpaperRouter);
app.use("/api/v1/paper", paperRouter);
module.exports = app;
