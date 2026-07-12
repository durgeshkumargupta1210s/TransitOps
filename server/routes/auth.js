const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { body, validationResult } = require("express-validator");

const User = require("../models/user");

// ==============================
// REGISTER
// ==============================
router.post(
  "/register",
  body("name").trim().notEmpty(),
  body("email").trim().normalizeEmail().isEmail(),
  body("password").isLength({ min: 6 }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, password, role } = req.body;

      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "Dispatcher",
      });

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
      );

      try {
        const io = req.app.get("io");

        if (io) {
          io.emit("user:login", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            at: new Date(),
          });
        }
      } catch {}

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==============================
// LOGIN
// ==============================
router.post(
  "/login",
  body("email").trim().normalizeEmail().isEmail(),
  body("password").notEmpty(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const matched = await bcrypt.compare(
        password,
        user.password
      );

      if (!matched) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
      );

      const refreshToken = crypto
        .randomBytes(40)
        .toString("hex");

      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );

      await user.save();

      try {
        const io = req.app.get("io");

        if (io) {
          io.emit("user:login", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            at: new Date(),
          });
        }
      } catch {}

      res.json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==============================
// REFRESH TOKEN
// ==============================
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const user = await User.findOne({
      refreshToken,
    });

    if (
      !user ||
      !user.refreshTokenExpiry ||
      user.refreshTokenExpiry < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      success: true,
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

// ==============================
// LOGOUT
// ==============================
router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findOne({
        refreshToken,
      });

      if (user) {
        user.refreshToken = null;
        user.refreshTokenExpiry = null;

        await user.save();
      }
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;