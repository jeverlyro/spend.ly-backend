const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authService = require("./services/authService");
const transactionRoutes = require("./routes/transactionRoutes");
const authController = require("./controllers/authController");

require("dotenv").config();

connectDB();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRoutes");
const supportRouter = require("./routes/supportRoutes");
const walletRoutes = require("./routes/walletRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use(express.json());



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(passport.initialize());

// Add debug logs for Google OAuth configuration
console.log("Google OAuth Configuration:");
console.log(`- Client ID exists: ${!!process.env.GOOGLE_CLIENT_ID}`);
console.log(`- Client Secret exists: ${!!process.env.GOOGLE_CLIENT_SECRET}`);
console.log(`- Callback URL: ${process.env.GOOGLE_CALLBACK_URL || "Not set"}`);
console.log(`- Backend URL: ${process.env.BACKEND_URL || "Not set"}`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${
          process.env.BACKEND_URL || "http://localhost:5000"
        }/api/auth/google/callback`,
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


// Daftarkan API
app.use("/api/incomes", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/support", supportRouter);
app.use("/api", walletRoutes);
app.use("/api", transactionRoutes);

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  (req, res, next) => {
    // Debug logging for callback
    console.log("Google OAuth Callback received:");
    console.log(`- Query parameters: ${JSON.stringify(req.query)}`);
    console.log(
      `- Using callback URL: ${
        process.env.GOOGLE_CALLBACK_URL || "default URL"
      }`
    );
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const userData = req.user;

      if (!userData || !userData.token) {
        console.error("Google auth: Missing user data or token");
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/login?error=missing_user_data`
        );
      }

      console.log(`Google auth successful for: ${userData.user.email}`);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${
        userData.token
      }&name=${encodeURIComponent(
        userData.user.name
      )}&email=${encodeURIComponent(
        userData.user.email
      )}&photo=${encodeURIComponent(userData.user.photo || "")}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/login?error=callback_error`
      );
    }
  }
);

app.post("/api/auth/forgot-password", authController.forgotPassword);
app.post("/api/auth/reset-password", authController.resetPassword);

app.get("/api/debug-env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "Not set",
    google: {
      clientIdExists: !!process.env.GOOGLE_CLIENT_ID,
      clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || "Not set",
    },
    urls: {
      backendUrl: process.env.BACKEND_URL || "Not set",
      frontendUrl: process.env.FRONTEND_URL || "Not set",
    },
    serverUrl: `${req.protocol}://${req.get("host")}`,
  });
});

app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  next(createError(404));
});

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
