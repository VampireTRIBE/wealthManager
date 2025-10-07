const passport = require("passport");
const user = require("../models/user");
const localStrategy = require("passport-local");

async function passportAuthentication(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(user.authenticate()));
  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());
}
module.exports = passportAuthentication;
