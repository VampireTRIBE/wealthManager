module.exports.isLogedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ authenticated: false, message: "Not Logged In" });
};
