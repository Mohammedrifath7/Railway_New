// models/Grievance.js
const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  phoneNumber : String,
  trainNumber: String,
  pnrNumber: String,
  problemDescription: String,
  type: String,
  incidentDate: String,
  incidentTime: String,
  filePath: String
});

module.exports = mongoose.model('Grievance', grievanceSchema);
