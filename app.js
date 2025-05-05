const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();

// Connect to database
connectDB();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRoutes");
const supportRouter = require("./routes/supportRoutes");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/support", supportRouter);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // Log error details
  console.error(`Error ${err.status || 500}: ${err.message}`);
  console.error(`Request path: ${req.path}`);

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send error response as JSON if it's an API request
  if (req.path.startsWith("/api")) {
    return res.status(err.status || 500).json({
      error: true,
      message: err.message,
      status: err.status || 500,
    });
  }

  // Render error page for non-API requests
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
