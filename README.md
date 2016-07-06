# Employee_payslip

A barebones Node.js app cloned from  https://devcenter.heroku.com/getting-started-with-nodejs in order to deploy a custom project on heroku.

## Running Locally

```sh
$ git clone https://github.com/rohitarjunagi/Employee_payslip.git # or clone your own fork
$ cd Employee_payslip
$ npm install
$ npm start
```
## Running Test cases Locally

```sh
$ npm test
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
      "annual_salary" : 23400,
      "super_rate" : "10%",
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
- Here is the sample Response :

```json

{  
   "response":[  
      {  
         "name":"Rudd David",
         "pay_period":"01 March – 31 March",
         "gross_income":"1950",
         "income_tax":"82",
         "net_income":1868,
         "super":"195"
      },
      {  
         "name":"Ryan Chen",
         "pay_period":"01 March – 31 March",
         "gross_income":"25000",
         "income_tax":"9046",
         "net_income":15954,
         "super":"2500"
      }
   ]
}

```
- If any of the fields are missing, you'll get an error
- If the annual salary is a negative number, you'll get an error
- If the super rate is more is negative or more than 50%, you will get an error
