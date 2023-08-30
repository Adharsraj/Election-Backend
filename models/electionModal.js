let mongoose = require("mongoose");

let electionSchema = new mongoose.Schema({
  representatives: [
    {
      name: String,
      location: String,
      age: Number,
      gender: String,
    },
  ],
  electionName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model("election", electionSchema);
