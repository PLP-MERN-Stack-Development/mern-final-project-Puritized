// backend/controllers/authController.js

// Example: get current logged-in user
export const getCurrentUser = (req, res) => {
  try {
    // req.user should be set by your auth middleware (JWT or session)
    if (!req.user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    // send user info to frontend
    res.json({ user: req.user });
  } catch (err) {
    console.error('Fetch current user failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};