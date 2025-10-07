// pakages and port
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

//passPort Authentication
passportAuth(app);

//data Parsers
dataParser.bodyParser(app);

//Locals
app.use(Locals);

//route modules
const userRoute = require("./routes/user");

// for listning all requests
app.listen(port, () => {
  console.log(`Server Running : port : ${port}`);
});

// Diffrent Routes
app.use("/", userRoute);
