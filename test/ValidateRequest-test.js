var assert = require('chai').assert;
var validateRequest = require('../ValidateRequest');

var validateEmployees = new validateRequest();

describe('Test the ValidateRequest library', function() {
  describe('#validateRequestBody()', function() {
    it('should validate the request body', function(done) {

      var request;
      var content_type = 'application/json'
      var request = {
        "employee_data": [{
          "first_name": "David",
          "last_name": "Rudd",
          "annual_salary": 2340,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }, {
          "first_name": "Chen",
          "last_name": "Ryan",
          "annual_salary": 300000,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }]
      };
      validateEmployees.validateRequestBody(request, content_type, function(err) {
        if (err) return done(err);
        done();
      })
    });
    it('should produce an error for invalid request header', function(done) {
      var content_type = 'application/xml'
      var request = {
        "employee_data": [{
          "first_name": "David",
          "last_name": "Rudd",
          "annual_salary": 2340,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }, {
          "first_name": "Chen",
          "last_name": "Ryan",
          "annual_salary": 300000,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }]
      };
      validateEmployees.validateRequestBody(request, content_type, function(err) {
        assert.equal(err.message, 'Only Json content-types are processed for now!');
        done();
      })
    });

    it('should produce an error for empty body', function(done) {
      var content_type = 'application/json';
      var request = {};
      validateEmployees.validateRequestBody(request, content_type, function(err) {
        assert.equal(err.message, 'Request Body is empty!');
        done();
      });
    });

    it('should produce an error for no employee data', function(done) {
      var content_type = 'application/json';
      var request = {
        "garbage_data": [{
          "first_name": "David",
          "last_name": "Rudd",
          "annual_salary": 2340,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }, {
          "first_name": "Chen",
          "last_name": "Ryan",
          "annual_salary": 300000,
          "super_rate": "10%",
          "payment_start_date": "01 March – 31 March"
        }]
      };
      validateEmployees.validateRequestBody(request, content_type, function(err) {
        assert.equal(err.message, 'Request Body does not contain the employee_data!');
        done();
      });
    });

    it('should produce an error for employee data being zero', function(done) {
      var content_type = 'application/json';
      var request = {
        "employee_data": []
      };
      validateEmployees.validateRequestBody(request, content_type, function(err) {
        assert.equal(err.message, 'Employee_data Length is 0!');
        done();
      });
    });
  });

  describe('#validateRequestData()', function() {
    it('should validate the request data', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": 2340,
        "super_rate": "10%",
        "payment_start_date": "01 March – 31 March"
      }, {
        "first_name": "Chen",
        "last_name": "Ryan",
        "annual_salary": 300000,
        "super_rate": "10%",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) return done(err);
        done();
      });
    });

    it('should produce an error for incorrect last name', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": 12345,
        "annual_salary": 2340,
        "super_rate": "10%",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Last Name in Employee No: 0');
          done();
        }
      });
    });

    it('should produce an error if super is more than 50%', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": 23340,
        "super_rate": "80%",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate in Employee No: 0');
          done();
        }
      });
    });

    it('should produce an error if super rate has more than 1 occurence of %', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": 23340,
        "super_rate": "asdfbmbnmbnmbnmbnm",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate in Employee No: 0');
          done();
        }
      });
    });

    it('should produce an error if super rate does not have a %', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": 23340,
        "super_rate": "80",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate in Employee No: 0');
          done();
        }
      });
    });

    it('should produce an error if annual salary is less than 0', function(done) {
      var request = [{
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": -100,
        "super_rate": "10%",
        "payment_start_date": "01 March – 31 March"
      }];
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Annual Salary in Employee No: 0');
          done();
        }
      });
    });
  });
});