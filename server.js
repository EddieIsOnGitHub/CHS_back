require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const mongoose = require("mongoose");
const emailRoutes = require("./routes/email");

const app = express();

// 🔗 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "chs" })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });


// Global Middleware

// Security + parsing
app.use(express.json({ limit: "1mb" })); // Prevents large JSON payloads

//  Use morgan for clean, timestamped logs (instead of manual console.log)
app.use(morgan("dev"));

//  Rate limiter applied globally
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins window
  max: 20, // 20 requests per IP
  standardHeaders: true, // Return rate limit info in headers, use to prevent multiple requests
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);


// CORS Configuration

const allowedOrigins = [
  "http://localhost:5173",
  "https://proud-forest-07ea4d00f.1.azurestaticapps.net",
  "https://chs-front-gfy9unvj8-eddieisongithubs-projects.vercel.app", // ✅ your live frontend
  ...(process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(",").map((o) => o.trim())
    : []),
];


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like Postman or server-to-server requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(` Blocked CORS request from: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);


//  Routes


// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend is alive!" });
});

//  Group API routes under a version prefix
app.use("/api", emailRoutes);


//  Global Error Handling


app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message || "N/A" });
});


// Server Start


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
