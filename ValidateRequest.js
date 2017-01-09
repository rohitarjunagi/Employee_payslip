/**
This module is used to check for the validity of the request body object
as well as the validity of the employee details values
*/
var _ = require('lodash');
exports = module.exports = ValidateRequest;

//empty constructor
function ValidateRequest() {

};

/**
This function checks if the employee data has sane values.
*/
ValidateRequest.prototype.validateRequestData = function(employee_data, cb) {
  var employeeData = employee_data;
    var err;
    console.log('inside validate request?????');
    //if request body has incorrect last name, return error
    if (!checkFirstName(employeeData)) {
      err = new Error('Incorrect First Name');
      return cb(err);
    }
    //if request body has incorrect first name, return error
    if (!checkLastName(employeeData)) {
      err = new Error('Incorrect Last Name');
      return cb(err);
    }
    //if request body has incorrect salary value, return error
    if (!checkAnnualSalary(employeeData)) {
      err = new Error('Incorrect Annual Salary');
      return cb(err);
    }
    //if request body has incorrect super rate, return error
    if (!checkSuperRate(employeeData)) {
      err = new Error('Incorrect Super Rate');
      return cb(err);
    }
  cb(null);
}

/**
function to check if first name is valid
If function returns true, first name is valid.
Else first name is invalid
*/
function checkFirstName(employee) {
  if (!employee.hasOwnProperty('first_name') || typeof employee.first_name !== 'string' || !employee.first_name.match(/^[a-z]/i)) {
    return false;
  }
  return true;
}

/**
function to check if last name is valid.
If function returns true, last name is valid else,
Last name is invalid
*/
function checkLastName(employee) {
  //if employee does not have last name or if last name is not a string or if
  //first character of last name is not an alphabet, return false
  if (!employee.hasOwnProperty('last_name') || typeof employee.last_name !== 'string' || !employee.last_name.match(/^[a-z]/i)) {
    return false;
  }
  return true;
}

/**
Function to check if annual salary exists and is a valid number
*/
function checkAnnualSalary(employee) {
  //if employee does not have annual salary or if annual salarary
  //is not of type number, return false
  if (_.isEmpty(employee.annual_salary) || employee.annual_salary < 0) {
    return false;
  }
  return true;
}

/**
Function to check if super rate exists and is valid
If function returns True, super rate is valid
If function returns false, super rate is invalid
*/
function checkSuperRate(employee) {
  //if employee does not have a super rate or if super rate is not a type of string, return false
  if (!employee.hasOwnProperty('super_rate') || typeof employee.super_rate !== 'string') {
    return false;
  }
  var super_rate = employee.super_rate.replace(new RegExp('%', 'g'), "");
  // if super contains an alphabet, return false
  if (super_rate.match(/[a-z]/i)) {
    return false;
  }
  // if super rate is less than 0% or greater than 50%, return false
  if (super_rate < 0 || super_rate > 50) {
    return false
  }
  return true;
}

/**
Function to check if given payment start date is valid.
If function returns true, start date is valid. Else, start date is invalid

function checkDateRange(employee) {
  //if payment start date does not exist or if payment start date is not of type string, return false
  if (!employee.hasOwnProperty('payment_start_date') || typeof employee.payment_start_date !== 'string') {
    return false;
  }
  // if payment start date does not contain - then return false
  if (employee.payment_start_date.indexOf('-') == -1) {
    return false;
  }

  var dateRange = employee.payment_start_date.split('-');
  var startDate = new Date(dateRange[0]);
  var endDate = new Date(dateRange[1]);
  //if sart or end date is invalid, return false
  if (startDate == 'Invalid Date' || endDate == 'Invalid Date') {
    return false;
  }
  // get date difference in milliseconds
  var dateDiff = Math.abs(endDate - startDate);
  //check if date range is not a number. If yes, return false
  if (isNaN(dateDiff)) {
    return false;
  }
  // divide dateDiff by 1000 * 3600 * 24 to get difference in days
  var daysDiff = Math.round((dateDiff / 86400000) + 1);
  /* if month is jan, mar, may, july, aug, oct, dec and
     difference in days is less than 31 oe greater than 31,
     return false

     if month is feb and difference in days is less than 28
     or greater than 29, return false

     if month is apr, jun, sep, nov and difference in days
     is less than 30 or greater than 30, return false
    
  switch (startDate.getMonth()) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      if (daysDiff !== 31) return false;
      else return true;
      break;
    case 1:
      if (daysDiff < 28 || daysDiff > 29) return false;
      else return true;
      break;
    case 3:
    case 5:
    case 8:
    case 10:
      if (daysDiff !== 30) return false;
      else return true;
      break;
    default:
      return false;
  }
}*/