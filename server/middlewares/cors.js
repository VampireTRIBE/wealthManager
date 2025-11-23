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
    app.use(cors(corsOptions));

    app.use((req, res, next) => {
      if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.sendStatus(204);
      }
      next();
    });
  },
};

module.exports = corsAuth;
