const mongoose = require('mongoose');

const OutputSchema = new mongoose.Schema({
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'programme'
  },
  connectedBudgetlines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'budgetline'
    }
  ],
  name: {
    type: String,
    required: true
  },
  activities: [
    {
      activityName: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('output', OutputSchema);
