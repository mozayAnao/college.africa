module.exports = (req, res, next) => {
  console.log(req.user);
  if (!req.user.is_admin) return res.status(403).send("Access denied");

  next();
};
