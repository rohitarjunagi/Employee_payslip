//import required modules
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var util = require('util');
var config = require('./config');
var mongoose = require('mongoose');
var validateRequest = require('./ValidateRequest');
var processEmployeeData = require('./ProcessEmployeeData');
var path = require('path');
var Payslip = require('./Models/payslip');
var processEmployeePostData = new processEmployeeData();
//initialize express
var app = express();
// Initialize database connection - throws if database connection can't be 
// established
mongoose.connect(config.mongoUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "ProcessEmployeeDataApp",
  saveUninitialized: true,
  resave: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash()); // use connect-flash for flash messages stored in session
app.get('/', function(request, response) {
  response.render('pages/index',{
              message: request.flash('message')
            });
});


app.post('/postEmployeeData', postEmployeeData());
app.post('/storePayData', storePayData());

//define the error handlers
app.use(function(err, req, res, next) {
  if (err.status === 400) {
    res.status(400).send({
      "error": "Could not decode request: JSON parsing failed"
    });
  } else {
    res.status(err.status || 500).send(err.message);
  }
});
/**
Function to take in the posted data and send back data to client
in the requested format
*/
function postEmployeeData() {
  return function(req, res, next) {
    console.log('what is request body???????   '+util.inspect(req.body));
        processEmployeePostData.processResponse(req.body, function(err, response) {
          if (err) {
            console.log('what is message????'+err.message);
            req.flash('message', err.message);
            return res.render('pages/Payslip',{
              message: req.flash('message')
            });
            //return res.status(400).send(err.message);
          }
          console.log('what is response????????   '+util.inspect(response));
          req.session.employeeData = response;
          res.render('pages/Payslip',{
              data : response,
              message: req.flash('message')
            });
        });
  }
}

function storePayData() {
  return function(req, res, next) {
    var payData = req.session.employeeData;
    console.log('what is payslip data??????????   '+util.inspect(payData));
    Payslip.find({name : payData.name}, function(err, doc) {
      if(err) {
        req.flash('message', 'Mongo DB Error');
        return res.redirect('/');
      }
      if(!_.isEmpty(doc)) {
        req.flash('message', 'Data already stored against employee : '+payData.name);
        return res.redirect('/');
      }
      var payslip = new Payslip({
      name : payData.name,
      gross_income : payData.gross_income,
      income_tax : payData.income_tax,
      net_income : payData.net_income,
      super : payData.super,
      pay : payData.pay,
      annual_income : payData.annual_income,
      pay_date : payData.pay_date
    });
    payslip.save(function(err, doc) {
      if(err) {
        req.flash('message', 'Error in storing Document!');
        return res.redirect('/');
      }
      req.flash('message' , 'Pay Data stored successfully for : '+payData.name);
      return res.redirect('/')
    });
    });
  }
}

//Start the server on a the specified port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//print stack trace for uncaught exceptions
process.on('uncaughtException', function(err) {
  console.error('#--------- uncaughtException --------#');
  console.error(err);
});