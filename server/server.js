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
const assetsCatRoute = require("./routes/assets/assetsCat");
const assetsProductRoute = require("./routes/assets/assetsProduct");
const assetsStatementRoute = require("./routes/assets/assetsStatement");
const assetsTransactionRoute = require("./routes/assets/assetsTransaction");

// for listning all requests
app.listen(port, () => {
  console.log(`Server Running : port : ${port}`);
});

// Diffrent Routes
app.use("/", userRoute);
app.use("/assets/:u_id/", assetsCatRoute);
app.use("/assets/product/:u_id/:c_id/", assetsProductRoute);
app.use("/assets/statement/:u_id/:c_id/", assetsStatementRoute);
app.use("/assets/transaction/:u_id/:p_id/", assetsTransactionRoute);

// error handling middleware
// app.use((err, req, res, next) => {
//   const { status = 500, message = "Some Error" } = err;
//   console.log(`Status Code : ${status}\nMessage : ${message}`);
//   res.send(`Status : ${status}\nMessage : ${message}`);
// });
