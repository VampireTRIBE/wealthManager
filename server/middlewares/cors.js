var cors = require("cors");
var corsOptions = {
  origin: "http://localhost:5173",
  method: "GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};

const corsAuth = {
  async corAuth(app) {
    app.use(cors(corsOptions));
  },
};
module.exports = corsAuth;
