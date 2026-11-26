const {test, expect, request} = require("@playwright/test");
const { env } = require('../utils/credentials');
const {ApiUtils} = require('../utils/ApiUtils');
const loginPayLoad ={userEmail:env('ECOM_EMAIL'),userPassword:env('ECOM_PASSWORD')};
const orderPayload ={orders:[{country:"India",productOrderedId:"6960eac0c941646b7a8b3e68"}]};
let response;

test.beforeAll(async ()=>            //run before all tests
{
    const apiContext = await request.newContext();
    const apiUtils =  new ApiUtils(apiContext, loginPayLoad);
    response= await apiUtils.createOrder(orderPayload);
         
});

//create order is successfull
test('@API Place the order',async ({page})=>
{
   await page.addInitScript(value => {
    window.localStorage.setItem('token',value);
   }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
     await page.locator("tbody").waitFor();
    const rows= await page.locator("tbody tr");
   

    for(let i=0; i< await rows.count(); ++i)
        {
       const rowOrderId= await rows.nth(i).locator("th").textContent();
       if(response.orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
       }
    }
    const orderIdDeatils= await page.locator(".col-text").textContent();
    //await page.pause();
    expect(response.orderId.includes(orderIdDeatils)).toBeTruthy();
    //await page.pause();
});