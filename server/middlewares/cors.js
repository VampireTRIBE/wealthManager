// middlewares/cors.js
var cors = require("cors");

var corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://wealthmanager-uema.onrender.com",
      "https://wealthmanager-backend-1y3o.onrender.com",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },

  methods: "GET, POST, PUT, PATCH, DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
};

const corsAuth = {
  async corAuth(app) {
    app.options("*", cors(corsOptions));
    app.use(cors(corsOptions));
  },
};

module.exports = corsAuth;
