const mongoose = require('mongoose');

const BudgetLineSchema = new mongoose.Schema({
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'programme'
  },
  name: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  initialAmount: {
    type: Number,
    required: true
  },
  unusedAmount: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('budgetline', BudgetLineSchema);
