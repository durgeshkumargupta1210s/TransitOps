const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');

router.post('/register',
  body('name').trim().notEmpty(),
  body('email').trim().normalizeEmail().isEmail(),
  body('password').trim().isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.warn('Validation failed on register:', { errors: errors.array(), body: req.body });
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role: role || 'Dispatcher' });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
      const payload = { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
      // Emit realtime login event
      try {
        const io = req.app.get('io');
        if (io) io.emit('user:login', { id: user._id, name: user.name, email: user.email, role: user.role, at: new Date() });
      } catch (e) { console.error('socket emit error', e); }

      res.json(payload);
    } catch (err) { next(err); }
  }
);

router.post('/login',
  body('email').trim().normalizeEmail().isEmail(),
  body('password').trim().exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.warn('Validation failed on login:', { errors: errors.array(), body: req.body });
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        console.warn(`Login failed: user not found for email=${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          console.warn(`Login failed: password mismatch for email=${email}`);
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (e) {
        console.error('bcrypt compare error', e);
        return res.status(500).json({ error: 'Server error' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
      // create refresh token
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const refreshExpiry = new Date(Date.now() + 1000*60*60*24*30); // 30 days
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = refreshExpiry;
      await user.save();

      // emit realtime login
      try {
        const io = req.app.get('io');
        if (io) io.emit('user:login', { id: user._id, name: user.name, email: user.email, role: user.role, at: new Date() });
      } catch (e) { console.error('socket emit error', e); }

      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token, refreshToken });
    } catch (err) { next(err); }
  }
);

// Refresh access token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
    if (!user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) return res.status(401).json({ error: 'Refresh token expired' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token });
  } catch (err) { next(err); }
});

// Logout - revoke refresh token
router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.json({ ok: true });
    const user = await User.findOne({ refreshToken });
    if (user) { user.refreshToken = null; user.refreshTokenExpiry = null; await user.save(); }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
