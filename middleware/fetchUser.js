const User = require("../models/User");

module.exports = async (req, res, next) => {
  // If no userId in session, move on
  if (!req.session || !req.session.userId) {
    return next();
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      // If user was deleted from DB but session still exists
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("FetchUser Middleware Error:", err);
    next(); // Don't crash the app, just move to next middleware
  }
};