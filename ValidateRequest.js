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
This function validates the request body
*/
ValidateRequest.prototype.validateRequestBody = function(req, content_type, cb) {
  var err;
  //check the payload type of the incoming data. If not json, return error
  if (!content_type || content_type !== 'application/json') {
    err = new Error('Only Json content-types are processed for now!');
    return cb(err);
  }
  //check if request body is empty
  if (_.isEmpty(req)) {
    err = new Error('Request Body is empty!');
    return cb(err);
  }
  //check if employee_data exists
  if (!req.employee_data) {

    err = new Error('Request Body does not contain the employee_data!');
    return cb(err);
  }
  //check if employee_data length is zero
  if (req.employee_data.length === 0) {
    err = new Error('Employee_data Length is 0!');
    return cb(err);
  }
  cb(null);
};

/**
This function checks if the employee data has sane values.
*/
ValidateRequest.prototype.validateRequestData = function(employee_data, cb) {
  var employeeData = employee_data;
  for (var i = 0; i < employeeData.length; i++) {
    var err;
    //if request body has incorrect last name, return error
    if (!checkFirstName(employeeData[i])) {
      err = new Error('Incorrect First Name in Employee No: ' + i);
      return cb(err);
    }
    //if request body has incorrect first name, return error
    if (!checkLastName(employeeData[i])) {
      err = new Error('Incorrect Last Name in Employee No: ' + i);
      return cb(err);
    }
    //if request body has incorrect salary value, return error
    if (!checkAnnualSalary(employeeData[i])) {
      err = new Error('Incorrect Annual Salary in Employee No: ' + i);
      return cb(err);
    }
    //if request body has incorrect super rate, return error
    if (!checkSuperRate(employeeData[i])) {
      err = new Error('Incorrect Super Rate in Employee No: ' + i);
      return cb(err);
    }

  }
  cb(null);
}

/**
function to check if first name is valid
*/
function checkFirstName(employee) {
  if (!employee.hasOwnProperty('first_name') || typeof employee.first_name !== 'string' || !employee.first_name.match(/^[a-z]/i)) {
    return false;
  }
  return true;
}

/**
function to check if last name is valid
*/
function checkLastName(employee) {
  if (!employee.hasOwnProperty('last_name') || typeof employee.last_name !== 'string' || !employee.last_name.match(/^[a-z]/i)) {
    return false;
  }
  return true;
}

/**
Function to check if annual salary exists and is a valid number
*/
function checkAnnualSalary(employee) {
  if (!employee.hasOwnProperty('annual_salary') || typeof employee.annual_salary !== 'number' || employee.annual_salary < 0) {
    return false;
  }
  return true;
}

/**
Function to check if super rate exists and is valid
*/
function checkSuperRate(employee) {
  if (!employee.hasOwnProperty('super_rate') || typeof employee.super_rate !== 'string') {
    return false;
  }
  if (employee.super_rate.indexOf('%')=== -1) {
    return false;
  }
  var super_rate = employee.super_rate.replace(new RegExp('%', 'g'), "");
  if (super_rate.match(/[a-z]/i)) {
    return false;
  }
  if (super_rate < 0 || super_rate > 50) {
    return false
  }
  return true;

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
    */
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
}