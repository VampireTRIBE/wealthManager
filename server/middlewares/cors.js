var cors = require("cors");
var corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("https://wealthmanager-uema.onrender.com")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};

const corsAuth = {
  async corAuth(app) {
    app.use(cors(corsOptions));
  },
};
module.exports = corsAuth;
