//import required modules
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var validateRequest = require('./ValidateRequest');
var processEmployeeData = require('./ProcessEmployeeData');
//initialize express
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


app.post('/postEmployeeData', postEmployeeData());

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
    var processEmployeePostData = new processEmployeeData();
    var conType = req.headers['content-type'];
        processEmployeePostData.processResponse(req.body, conType, function(err, response) {
          if (err) {
            return res.status(400).send(err.message);
          }
          res.header("Content-Type", "application/json");
          res.status(201).send(response);
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