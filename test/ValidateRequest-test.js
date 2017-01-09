var assert = require('chai').assert;
var validateRequest = require('../ValidateRequest');

var validateEmployees = new validateRequest();

describe('Test the ValidateRequest library', function() {
  describe('#validateRequestData()', function() {
    it('should validate the correct request data', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "2340",
        "super_rate": "10%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        console.log(err);
        if (err) return done(err);
        done();
      });
    });

    it('should produce an error if last name is not a type of string', function(done) {
      var request = {
        "first_name": "David",
        "last_name": 8370,
        "annual_salary": "2340",
        "super_rate": "10%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Last Name');
          return done();
        }
        done();
      });
    });

    it('should produce an error if last name does not have first character as a letter', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "1Rudd",
        "annual_salary":"2340",
        "super_rate": "10%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Last Name');
          return done();
        }
        done();
      });
    });

    it('should produce an error if super is more than 50%', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "23340",
        "super_rate": "80%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate');
          return done();
        }
        done();
      });
    });

    it('should produce an error if super rate has more than 1 occurence of %', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "23340",
        "super_rate": "asdfbmbnmbnmbnmbnm"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate');
          return done();
        }
        done();
      });
    });

    it('should produce an error if super rate does not have a %', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "23340",
        "super_rate": "80"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate');
          return done();
        }
        done();
      });
    });

    it('should produce an error if super rate has an alphabet %', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "23340",
        "super_rate": "abcde%%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Super Rate');
          return done();
        }
        done();
      });
    });

    it('should produce an error if annual salary is less than 0', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "-100",
        "super_rate": "10%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Annual Salary');
          return done();
        }
        done();
      });
    });

    it('should produce an error if payment start date is invalid', function(done) {
      var request = {
        "first_name": "David",
        "last_name": "Rudd",
        "annual_salary": "23000",
        "super_rate": "10%"
      };
      validateEmployees.validateRequestData(request, function(err) {
        if (err) {
          assert.equal(err.message, 'Incorrect Date Range');
          return done();
        }
        done();
      });
    });
  });
});