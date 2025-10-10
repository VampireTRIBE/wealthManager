function Locals(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curr_user = req.user;
  next();
}

module.exports = Locals;
