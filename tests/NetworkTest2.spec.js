const { test,expect } = require('@playwright/test');
const { env } = require('../utils/credentials');

test('Security test request intercept', async ({ page }) => {
    //login and reach order page

    const email = env('ECOM_EMAIL');
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(env('ECOM_PASSWORD'));
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    //request call
    await page.locator("button[routerlink*='myorders']").click();     //Orders page has the View buttons, Cart does not
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b'}));   //handler must be the 2nd argument
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})