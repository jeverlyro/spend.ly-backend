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
const accountRoutes = require("./routes/accountRoutes");
const indexRouter = require("./routes/index"); // Keep this declaration
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRoutes");

// Load environment variables
require("dotenv").config();

// Connect to database
connectDB();

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
app.use("/api/accounts", accountRoutes);

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
      const userData = req.user;

      if (!userData || !userData.token) {
        console.error("Google auth: Missing user data or token");
        return res.redirect(
          "http://localhost:3000/login?error=missing_user_data"
        );
      }

      console.log(`Google auth successful for: ${userData.user.email}`);

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

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error ${err.status || 500}: ${err.message}`);
  console.error(`Request path: ${req.path}`);

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (req.path.startsWith("/api")) {
    return res.status(err.status || 500).json({
      error: true,
      message: err.message,
      status: err.status || 500,
    });
  }

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
