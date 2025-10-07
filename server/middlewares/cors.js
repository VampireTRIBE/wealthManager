var cors = require("cors");
var corsOptions = {
  origin: "http://localhost:5173",
  method: "GET, POST, PUT, PATCH, DELETE",
};

const corsAuth = {
  async corAuth(app) {
    app.use(cors(corsOptions));
  },
};
module.exports = corsAuth;
