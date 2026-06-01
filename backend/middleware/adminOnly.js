module.exports = function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  next();
};
