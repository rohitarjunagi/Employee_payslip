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
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});