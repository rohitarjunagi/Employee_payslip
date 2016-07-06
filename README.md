# Employee_payslip

A barebones Node.js app cloned from  https://devcenter.heroku.com/getting-started-with-nodejs in order to deploy a custom project on heroku.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone https://github.com/rohitarjunagi/Employee_payslip.git # or clone your own fork
$ cd Employee_payslip
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).


## Documentation

To use the app, post data to the app on this url: (http://localhost:5000/postEmployeeData)



- The Employee Data needs to be in application/json format
- The Data Should have the following fields
```json
{
  "employee_data" : [
    { "first_name" : "David",
  	  "last_name" : "Rudd",
      "annual_salary" : 24000,
      "super_rate" : "15%",
      "payment_start_date" : "01 March – 31 March"
    },
    { "first_name" : "Chen",
  	  "last_name" : "Ryan",
     "annual_salary" : 300000,
      "super_rate" : "10%",
     "payment_start_date" : "01 March – 31 March"
    }
    ]
}

```
- If any of the fields are missing, you'll get an error
- If the annual salary is a negative number, you'll get an error
- If the super rate is more is negative or more than 50%, you will get an error
