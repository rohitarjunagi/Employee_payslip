var _ = require('lodash');

exports = module.exports = ValidateRequest;

function ValidateRequest() {

};

ValidateRequest.prototype.validateRequestBody = function(req, cb) {
  var contype = req.headers['content-type'];
  var err;
  if (!contype || contype.indexOf('application/json') !== 0) {
    err = new Error('Only Json content-types are processed for now!');
    return cb(err);
  }
  if (_.isEmpty(req.body)) {
    err = new Error('Request Body is empty!');
    return cb(err);
  }
  //check if employee_data exists
  if (!req.body.employee_data) {

    err = new Error('Request Body does not contain the employee_data!');
    return cb(err);
  }
  //check if employee_data length is zero
  if (req.body.employee_data.length === 0) {
    err = new Error('employee_data Length is 0!!');
    return cb(err);
  }
  cb(null);
};

ValidateRequest.prototype.validateRequestData = function(employee_data, cb) {
  var employeeData = employee_data;
  for (var i = 0; i < employeeData.length; i++) {
    var err;
    //if request body has incorrect last name, return error
    if (!employeeData[i].hasOwnProperty('last_name') || typeof employeeData[i].last_name !== 'string') {
      err = new Error('Incorrect Last Name in Employee No: ' + i);
      return cb(err);
    }
    //if request body has incorrect first name, return error
    if (!employeeData[i].hasOwnProperty('first_name') || typeof employeeData[i].first_name !== 'string') {
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
  var super_rate = employee.super_rate.replace(/[\%]/, '');
  var super_rate = employee.super_rate.replace(new RegExp('%', 'g'), "");
  if (super_rate < 0 || super_rate > 50) {
    return false
  }
  return true;
}