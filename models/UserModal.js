const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const addUserSchema = new mongoose.Schema({
  membershipnumber: {
    type: String,
  },
  username: {
    type: String,
  },
  dob: {
    type: String,
  },
  public_id: {
    type: String,
  },
  email: {
    type: String,
  },
  url: {
    type: String,
  },
  age: {
    type: String,
  },
  contactnumber: {
    type: String,
  },
  otpmobilenumber: {
    type: String,
  },
  votingtype: {
    type: String,
  },
  presentAddress: {
    type: String,
  },
  permanentAddress: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  nomineeName: {
    type: String,
  },
  currentposition: {
    type: String,
  },
  aadharnumber: {
    type: String,
  },
  profession: {
    type: String,
  },
  remarks: {
    type: String,
  },
});

addUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

addUserSchema.methods.comparePassword = async function (userpassword) {
  const isMatch = await bcrypt.compare(userpassword, this.password);
  return isMatch;
};

addUserSchema.methods.createJWT = function () {
  const payload = { userId: this._id };
  const secret = "secretkey";
  const options = { expiresIn: "12h" };
  return Jwt.sign(payload, secret, options);
};
module.exports = mongoose.model("users", addUserSchema);
