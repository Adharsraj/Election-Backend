const mongoose = require("mongoose");

const addRepresentativeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  profileImage:{
    type: String,
  }
});


module.exports = mongoose.model("Rep", addRepresentativeSchema);


