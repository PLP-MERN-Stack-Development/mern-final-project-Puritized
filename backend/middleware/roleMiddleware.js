// ✅ Flexible role permission middleware
export const permit = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
    }

    next();
  };
};

// ✅ Strict admin-only middleware (used in admin routes)
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Admin access only",
    });
  }

  next();
};