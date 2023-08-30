const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const addUserSchema = new mongoose.Schema({
  membershipnumber: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  dob:{
    type: String,
    required: true,
  },
    public_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  age:{
    type: String,
    required: true,
  },
  contactnumber:{
    type: String,
    required: true,
  },
  otpmobilenumber:{
    type: String,
    required: true,
  },
  votingtype:{
    type: String,
    required: true,
  },
  presentAddress:{
    type: String,
    required: true,
  },
  permanentAddress:{
    type: String,
    required: true,
  },
  role:{
    type:String,
    default:"user"
  },
  nomineeName:{
    type: String,
    required: true,
  },
  currentposition:{
    type: String,
    required: true,
  },
  aadharnumber:{
    type: String,
    required: true,
  },
  profession:{
    type: String,
    required: true,
  },
  remarks:{
    type: String,
    required: true,
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
