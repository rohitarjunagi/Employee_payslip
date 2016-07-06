//import required modules
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
//use the json body parser to parse the request body
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.post('/postEmployeeData', sanitizeRequest(), postEmployeeData());

//use the method to validate request body
app.use(validateRequest());

//define the errorHandler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  var err = {
    "error": "Internal Server Error"
  }
  res.status(500).send(err);
  next();
});

/**
Function checks for obvious error conditions in the request body
*/
function validateRequest() {
  return function(req, res, next) {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0) {
      return res.status(400).send('Only Json content-types are processed for now!');
    }
    if (_.isEmpty(req.body)) {
      return res.status(400).send('Request Body is empty!');
    }
    //check if employee_data exists
    if (!req.body.employee_data) {
      return res.status(400).send('Request Body does not contain the employee_data!');
    }
    //check if employee_data length is zero
    if (req.body.employee_data.length === 0) {
      return res.status(400).send('employee_data Length is 0!!');
    }
    next();
  };
}

function postEmployeeData() {
  return function(req, res, next) {
    var return_data_array = [];
    var return_data = {};
    var reqBody = req.body.employee_data;
    for (var i = 0; i < reqBody.length; i++) {
      var employee = {};
      employee.name = reqBody[i].last_name + ' ' + reqBody[i].first_name;
      employee.pay_period = reqBody[i].pay_period;
      employee.gross_income = (reqBody[i].annual_salary / 12).toFixed(0);
      employee.income_tax = computeIncomeTax(reqBody[i].annual_salary);
      employee.net_income = employee.gross_income - employee.income_tax;
      employee.super = computeSuper(employee.gross_income, reqBody[i].super_rate);
      return_data_array.push(employee);
    }
    return_data.response = return_data_array;
    res.status(201).send(return_data);
  }
}
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

process.on('uncaughtException', function(err) {
  console.error('#--------- uncaughtException --------#');
  console.error(err);
});