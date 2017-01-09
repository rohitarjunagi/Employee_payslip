var assert = require('chai').assert;
var util = require('util');
var processEmployeeData = require('../ProcessEmployeeData');

var processEmployeePostData = new processEmployeeData();

describe('Test the ProcessEmployeeData library', function() {
  describe('#processResponse()', function() {
    it('The response should have the right values for the correct input data#try 1', function(done) {
      var request = {
          "first_name": "David",
          "last_name": "Rudd",
          "annual_salary": "23400",
          "super_rate": "10%"
      };
      processEmployeePostData.processResponse(request, function(err, data) {
        if (err) return done(err);
        assert.equal(data.name, "David Rudd");
        assert.equal(data.gross_income, "1950");
        assert.equal(data.income_tax, "82");
        assert.equal(data.net_income, "1868");
        assert.equal(data.super, "195");
        assert.equal(data.pay, "1673");

        done();
      })
    })

    it('The response should have the right values for the correct input data#try 2', function(done) {
      var request = {
          "first_name": "Chris",
          "last_name": "Hadfield",
          "annual_salary": "85000",
          "super_rate": "20%"
      };
      processEmployeePostData.processResponse(request, function(err, data) {
        if (err) return done(err);
        assert.equal(data.name, "Chris Hadfield");
        assert.equal(data.gross_income, "7083");
        assert.equal(data.income_tax, "1616");
        assert.equal(data.net_income, "5467");
        assert.equal(data.super, "1417");
        assert.equal(data.pay, "4050");
        done();
      })
    })
  });
});