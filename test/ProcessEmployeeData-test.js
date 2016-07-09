var assert = require('chai').assert;
var util = require('util');
var processEmployeeData = require('../ProcessEmployeeData');

var processEmployeePostData = new processEmployeeData();

describe('Test the ProcessEmployeeData library', function() {
  describe('#processResponse()', function() {
    it('The response should have the right values for the correct input data#try 1', function(done) {
      var content_type = "application/json";
      var request = {
        "employee_data": [{
          "first_name": "David",
          "last_name": "Rudd",
          "annual_salary": 23400,
          "super_rate": "10%",
          "payment_start_date": "01 March - 31 March"
        }]
      };
      processEmployeePostData.processResponse(request, content_type, function(err, data) {
        if (err) return done(err);
        assert.equal(data.response[0].name, "David Rudd");
        assert.equal(data.response[0].pay_period, '01 March - 31 March');
        assert.equal(data.response[0].gross_income, "1950");
        assert.equal(data.response[0].income_tax, "82");
        assert.equal(data.response[0].net_income, "1868");
        assert.equal(data.response[0].super, "195");

        done();
      })
    })

    it('The response should have the right values for the correct input data#try 2', function(done) {
      var content_type = "application/json";
      var request = {
        "employee_data": [{
          "first_name": "Chris",
          "last_name": "Hadfield",
          "annual_salary": 85000,
          "super_rate": "20%",
          "payment_start_date": "01 May - 31 May"
        }]
      };
      processEmployeePostData.processResponse(request, content_type, function(err, data) {
        if (err) return done(err);
        assert.equal(data.response[0].name, "Chris Hadfield");
        assert.equal(data.response[0].pay_period, '01 May - 31 May');
        assert.equal(data.response[0].gross_income, "7083");
        assert.equal(data.response[0].income_tax, "1616");
        assert.equal(data.response[0].net_income, "5467");
        assert.equal(data.response[0].super, "1417");

        done();
      })
    })
  });
});