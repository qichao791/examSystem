//引入mongoose
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE;
console.log(DB);
/*
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
*/
  mongoose
  .connect(DB, {
    user: "root",
    pass: "123456",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
const port = process.env.PORT || 3300;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
