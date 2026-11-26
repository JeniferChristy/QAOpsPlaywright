const {test, expect, request} = require("@playwright/test");
const {customtest} = require("../utils/fixtures.js")


customtest("fixtures demo", async({authenticatedPage,createOrder,testDataForOrder})=>
{
    //login to application/Create order and verify if the order is created from the History page
    await authenticatedPage.goto('https://rahulshettyacademy.com/client');
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
    console.log(testDataForOrder.productName);

})