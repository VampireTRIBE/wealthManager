if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const corAuth = require("./middlewares/cors");
const DB_connect = require("./config/connectDB");
const passportAuth = require("./middlewares/Authentication");
const sessionConfig = require("./middlewares/seasson");
const flash = require("connect-flash");
const dataParser = require("./middlewares/dataParser");
const Locals = require("./utills/locals/locals");
const app = express();
const path = require("path");
let port = 3000;

corAuth.corAuth(app);
DB_connect();
sessionConfig(app);
app.use(flash());
passportAuth(app);
dataParser.bodyParser(app);
app.use(Locals);

const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");

// for listning all requests
app.listen(port, () => {
  console.log(`Server Running : port : ${port}`);
});

// Diffrent Routes
app.use("/", userRoute);
app.use("/home/:id/:c_id/", categoryRoute);

//error handling middleware
// app.use((err, req, res, next) => {
//   const { status = 500, message = "Some Error" } = err;
//   console.log(`Status Code : ${status}\nMessage : ${message}`);
//   res.send(`Status : ${status}\nMessage : ${message}`);
// });
