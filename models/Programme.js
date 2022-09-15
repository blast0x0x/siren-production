const mongoose = require('mongoose');

const ProgrammeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  acronym: {
    type: String,
    required: true
  },
  donor: {
    type: String,
    required: true
  },
  total_budget: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  manager: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('programme', ProgrammeSchema);
