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
    if (!employeeData[i].hasOwnProperty('last_name') || typeof employeeData[i].last_name !== 'string' || !employeeData[i].last_name.match(/^[a-z]/i)) {
      err = new Error('Incorrect Last Name in Employee No: ' + i);
      return cb(err);
    }
    //if request body has incorrect first name, return error
    if (!employeeData[i].hasOwnProperty('first_name') || typeof employeeData[i].first_name !== 'string' || !employeeData[i].first_name.match(/^[a-z]/i)) {
      err = new Error('Incorrect First Name in Employee No: ' + i);
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
}