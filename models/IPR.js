const { isThisQuarter } = require('date-fns');
const mongoose = require('mongoose');

const IPRSchema = new mongoose.Schema({
  registerDate: {
    type: Date,
    required: true
  },
  iprNo: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'programme'
  },
  output: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'output'
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId
  },
  budgetline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'budgetline'
  },
  approvalDate: {
    type: Date
  },
  approvalState: {
    type: Number
  },
  approvalStage: {
    type: Number,
    required: true
  },
  allocationDate: {
    type: Date
  },
  RFQIssuanceDate: {
    type: Date
  },
  RFQEndDate: {
    type: Date
  },
  approvalCEODate: {
    type: Date
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  content: [
    {
      itemDescription: {
        type: String,
        required: true
      },
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      estimatedUnitPrice: {
        type: String,
        required: true
      },
      totalPrice: {
        type: String,
        required: true
      },
      remarks: {
        type: String
      },
    }
  ],
  notes: {
    type: String
  },
  isNewIPR: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ipr', IPRSchema);
