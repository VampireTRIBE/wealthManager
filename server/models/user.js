const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});
 
userSchema.plugin(passportLocalMongoose);

const users = mongoose.model("users", userSchema);
module.exports = users;
