const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authService = require("./services/authService");

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Initialize Passport
app.use(passport.initialize());

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = await authService.googleLogin(profile);
        return done(null, userData);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/support", supportRouter);

// Google auth routes
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login?error=google_auth_failed",
  }),
  (req, res) => {
    try {
      // Successful authentication, get userData from passport
      const userData = req.user;

      if (!userData || !userData.token) {
        console.error("Google auth: Missing user data or token");
        return res.redirect(
          "http://localhost:3000/login?error=missing_user_data"
        );
      }

      // Log successful authentication
      console.log(`Google auth successful for: ${userData.user.email}`);

      // Redirect to frontend with token and user data
      const redirectUrl = `http://localhost:3000/auth/callback?token=${
        userData.token
      }&name=${encodeURIComponent(
        userData.user.name
      )}&email=${encodeURIComponent(
        userData.user.email
      )}&photo=${encodeURIComponent(userData.user.photo || "")}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:3000/login?error=callback_error");
    }
  }
);

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
