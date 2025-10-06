// pakages and port

const express = require("express");
const app = express();
const path = require("path");

let port = 3000;


// for listning all requests
app.listen(port, () => {
  console.log(`Server Running : port : ${port}`);
});
