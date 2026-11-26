const { test, expect, request } = require("@playwright/test");
const { env } = require('../utils/credentials');
const { ApiUtils } = require('../utils/ApiUtils');
const loginPayLoad = { userEmail: env('ECOM_EMAIL'), userPassword: env('ECOM_PASSWORD') };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };
let response;

test.beforeAll(async () =>            //run before all tests
{
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayload);

});

//create order is successfull
test('Place the order', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response = await page.request.fetch(route.request());
            const body = JSON.stringify(fakePayLoadOrders);      //fulfill() needs a string, not an object
            await route.fulfill(
                {
                    response,
                    body
                });
            //intercepting response- API response->{Playwright fake response}->browser will send it to browser-> based on the response render data on front end
        });
    await page.locator("button[routerlink*='myorders']").click();
    await expect(page.getByText("You have No Orders to show at this time")).toBeVisible();    //fake empty response -> app shows "You have No Orders to show at this time."


    // for(let i=0; i< await rows.count(); ++i)
    //     {
    //    const rowOrderId= await rows.nth(i).locator("th").textContent();
    //    if(response.orderId.includes(rowOrderId))
    //     {
    //         await rows.nth(i).locator("button").first().click();
    //         break;
    //    }
    // }
    // const orderIdDeatils= await page.locator(".col-text").textContent();
    // //await page.pause();
    // expect(response.orderId.includes(orderIdDeatils)).toBeTruthy();
    // //await page.pause();
});