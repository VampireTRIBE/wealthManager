// pakages and port

const express = require("express");
const corAuth = require("./middlewares/cors");
const app = express();
const path = require("path");
let port = 3000;

corAuth.corAuth(app);

// for listning all requests
app.listen(port, () => {
  console.log(`Server Running : port : ${port}`);
});

app.get("/login", (req, res) => {
  console.log("working");
  res.send("working");
});
