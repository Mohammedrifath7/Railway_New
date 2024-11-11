const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  phoneNumber:String,
  pnrNumber: String,
  department: String
});

module.exports = mongoose.model('Category', categorySchema);