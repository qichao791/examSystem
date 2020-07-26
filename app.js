const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser')

const scoreRouter = require("./routes/scoreRoutes");


const app = express();


console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan.apply("dev"));
}
app.use(morgan("dev"));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/api/v1/score", scoreRouter);

module.exports = app;
