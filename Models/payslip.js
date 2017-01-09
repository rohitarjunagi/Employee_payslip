var mongoose = require('mongoose');

// Define user model schema  available specialization slots
//rating 
var payslipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pay_period : {
    type: Date,
    required: false
  },
  gross_income: {
    type: String,
    required: false
  },
  income_tax: {
    type: String,
    required: false
  },
  net_income: {
    type: String,
    required: false
  },
  super: {
    type: String,
    required: true
  },
  pay: {
    type: String,
    required: false
  },
  annual_income: {
    type: String,
    required: false
  }
}, { collection: 'PaySlip' });

// Export user model
module.exports = mongoose.model('PaySlip', payslipSchema);
