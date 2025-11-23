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
const assetsLiveLTP = require("./routes/assets/marketPrice");
const assetsIrr = require("./routes/assets/assetsIrr");
const { updateLivePrices } = require("./controllers/assets/marketPrice");
const updateCurveValues = require("./controllers/assets/assetsCategoryCurve");
const log = require("./utills/logers/logger");

// for listning all requests
app.listen(process.env.PORT, async () => {
  log.running(`SERVER PORT : ${process.env.PORT}`);
  try {
    log.running("INITIAL SERVER UPDATE");
    const { success } = await updateCurveValues();
    success ? "" : await updateCurveValues();
    await updateLivePrices();
    log.success("INITIAL SERVER UPDATE COMPLETED");
  } catch (err) {
    log.error(`${err.message}`);
  }
  setTimeout(() => {
    setInterval(async () => {
      try {
        await updateLivePrices();
      } catch (err) {}
    }, 1 * 60 * 1000);
  }, 20000);
});

// Diffrent Routes
app.use("/", userRoute);
app.use("/:u_id/live", assetsLiveLTP);
app.use("/assets/:u_id/", assetsCatRoute);
app.use("/assets/product/:u_id/:c_id/", assetsProductRoute);
app.use("/assets/statement/:u_id/:c_id/", assetsStatementRoute);
app.use("/assets/transaction/:u_id/:p_id/", assetsTransactionRoute);
app.use("/assets/irr/:u_id/:c_id/", assetsIrr);

// error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Some Error" } = err;
  console.log(`Status Code : ${status}\nMessage : ${message}`);
  res.send(`Status : ${status}\nMessage : ${message}`);
});
