// backend/models/DemoRequest.js
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
}, { timestamps: true });

module.exports = mongoose.model("EMRSubmission", emrSchema);
