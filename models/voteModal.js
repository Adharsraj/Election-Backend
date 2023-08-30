let mongoose = require("mongoose");

let voteSchema = new mongoose.Schema({
  userid: Array,
  id: String,
  RepresentativeName: Array,
  voted: Boolean,
  electionName: String,
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model("vote", voteSchema);





