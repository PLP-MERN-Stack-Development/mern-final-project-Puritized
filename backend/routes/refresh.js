import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token." });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(401).json({ message: "Invalid refresh token." });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });

  } catch (err) {
    return res.status(403).json({ message: "Token expired or invalid." });
  }
});

export default router;