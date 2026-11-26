const base = require('@playwright/test');
const { env } = require('./credentials');



exports.customtest = base.test.extend(
    {
    testDataForOrder : {
    username:env('ECOM_EMAIL'),
    password:env('ECOM_PASSWORD'),
    productName:"Zara Coat 3"
    }
    }
)