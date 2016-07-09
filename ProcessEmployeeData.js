/**
This module makes use of the ValidateRequest module
to validate the employee data and then compute the
payslip and return the payslip in the requested format
*/
var util = require('util');
var validateRequest = require('./ValidateRequest');

exports = module.exports = ProcessEmployeeData;
//Empty constructor
function ProcessEmployeeData() {

};

/**
This function takes the request object as input and validates the
request object before computing the payslip
*/
ProcessEmployeeData.prototype.processResponse = function(req, content_type, cb) {
  var validateEmployees = new validateRequest();
  validateEmployees.validateRequestBody(req, content_type, function(err) {
    if (err) {
      return cb(err);
    }
    validateEmployees.validateRequestData(req.employee_data, function(err) {
      if (err) {
        return cb(err);
      }
      var return_data_array = [];
      var return_data = {};
      var employeesData = req.employee_data;
      for (var i = 0; i < employeesData.length; i++) {
        var employee = {};
        var super_rate;
        employee.name = employeesData[i].first_name + ' ' + employeesData[i].last_name;
        employee.pay_period = employeesData[i].payment_start_date;
        employee.gross_income = (employeesData[i].annual_salary / 12).toFixed(0);
        employee.income_tax = computeIncomeTax(employeesData[i].annual_salary);
        employee.net_income = employee.gross_income - employee.income_tax;
        super_rate = computeSuper(employee.gross_income, employeesData[i].super_rate);
        employee.super = super_rate;
        return_data_array.push(employee);
      }
      return_data.response = return_data_array;
      cb(null, return_data);

    });
  });
}

/**
Function to compute the Super Annuation for a given gross income
*/
function computeSuper(gross_income, rate) {
  var super_rate = rate.replace(new RegExp('%', 'g'), "");
  return (((gross_income * super_rate) / 100).toFixed(0));
}

/**
Function to compute the income tax for a given annual salary
*/
function computeIncomeTax(annual_salary) {
  if (annual_salary <= 18200) {
    return 0;
  } else if (annual_salary >= 18201 && annual_salary <= 37000) {
    return ((((annual_salary - 18200) * 0.19) / 12).toFixed(0));
  } else if (annual_salary >= 37001 && annual_salary <= 80000) {
    return (((3572 + (annual_salary - 37000) * 0.325) / 12).toFixed(0));
  } else if (annual_salary >= 80001 && annual_salary <= 180000) {
    return (((17547 + (annual_salary - 80000) * 0.37) / 12).toFixed(0));
  } else if (annual_salary >= 180001) {
    return (((54547 + (annual_salary - 180000) * 0.45) / 12).toFixed(0));
  }
}