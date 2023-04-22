module.exports = (req, res, next) => {
  if (!req.user.is_admin) return res.status(403).send("Access denied");

  next();
};
