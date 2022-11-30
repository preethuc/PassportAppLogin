import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
  },
  full_name: {
    type: String,
  },
  passport_number: {
    type: String,
  },
  gender: {
    type: String,
  },
  date_of_birth: {
    type: String,
  },
  password: {
    type: String,
  },
  passport_file: {
    type: String,
  },
  no_of_rejection: [
    {
      type: String,
    },
  ],
  permanent_ban: {
    type: Boolean,
  },
  login_reject: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
