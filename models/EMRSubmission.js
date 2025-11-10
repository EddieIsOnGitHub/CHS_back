const mongoose = require("mongoose");

const emrSchema = new mongoose.Schema({
  role: String,
  interests: [String],
  firstName: String,
  lastName: String,
  organization: String,
  website: String,
  address: String,
  email: String,
  phone: String,
  clinicians: String,
  emrStatus: String,
  currentEMR: String,
  goLive: String,
  additionalInfo: String,
  time: String,
  howHeard: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EMRSubmission", emrSchema);
