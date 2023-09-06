let mongoose = require("mongoose");

let electionSchema = new mongoose.Schema({
  representatives: [
    {
      membershipnumber:String,
      username: String,
      dob: String,
      public_id: String,
      email: String,
      url: 
      String,
      age: String,
      contactnumber: String,
      otpmobilenumber: String,
      votingtype: String,
      presentAddress: String,
      permanentAddress:String,
      role:String,
      nomineeName:String,
      currentposition:String,
      aadharnumber:String,
      profession:String,
      remarks:String,
    },
  ],
  electionName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  userid: Array,

});

module.exports = mongoose.model("election", electionSchema);
