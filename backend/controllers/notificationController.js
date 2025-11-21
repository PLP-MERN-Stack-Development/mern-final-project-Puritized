import Notification from "../models/Notification.js";

// Create notification
export const createNotification = async (userId, message) => {
  return await Notification.create({
    user: userId,
    message,
  });
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};