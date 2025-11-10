const mongoose = require("mongoose");

const staffingSchema = new mongoose.Schema({
  organization: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  industry: String,      
  position: String,      
  time: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StaffingSubmission", staffingSchema);
