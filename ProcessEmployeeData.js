/**
This module makes use of the ValidateRequest module
to validate the employee data and then compute the
payslip and return the payslip in the requested format
*/
var util = require('util');
var validateRequest = require('./ValidateRequest');
var validateEmployees = new validateRequest();

exports = module.exports = ProcessEmployeeData;
//Empty constructor
function ProcessEmployeeData() {

};

/**
This function takes the request object as input and validates the
request object before computing the payslip
*/
ProcessEmployeeData.prototype.processResponse = function(requestData, cb) {
    var employee_data = {};
    employee_data.first_name = requestData.first_name;
    employee_data.last_name = requestData.last_name;
    employee_data.annual_salary = requestData.annual_salary;
    employee_data.super_rate = requestData.super_rate;

    validateEmployees.validateRequestData(employee_data, function(err) {
      if (err) {
        return cb(err);
      }
      var employeesData = requestData;
        var employee = {};
        var super_rate;
        employee.name = employeesData.first_name + ' ' + employeesData.last_name;
        employee.name = employee.name.toLowerCase();
        employee.pay_period = employeesData.payment_start_date;
        employee.gross_income = (employeesData.annual_salary / 12).toFixed(0);
        employee.income_tax = computeIncomeTax(employeesData.annual_salary);
        employee.net_income = employee.gross_income - employee.income_tax;
        super_rate = computeSuper(employee.gross_income, employeesData.super_rate);
        employee.super = super_rate;
        employee.pay = employee.net_income - super_rate;
        employee.annual_income = requestData.annual_salary;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
          dd='0'+dd;
        } 
        if(mm<10){
          mm='0'+mm;
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        employee.pay_date = today;
        cb(null, employee);
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