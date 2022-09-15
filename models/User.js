const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  job: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contractNo: {
    type: String,
    required: true
  },
  approvalState: {
    type: Number,
    required: true
  },
  isFirstLogin: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
