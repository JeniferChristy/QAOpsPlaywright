const { test, expect } = require("@playwright/test");
const { env } = require('../utils/credentials');

test('Practice Login Page and Title', async ({ page }) => {
    const email = env('ECOM_EMAIL');
    const productName = 'ZARA COAT 3'
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(env('ECOM_PASSWORD'));
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();    //waitmechanism alternative for grab first title in the page.... for last title choose .last()
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    // A 1000ms typing delay left the suggestion dropdown stuck open, blocking "Place Order".
    await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    // The option list re-renders while typing, so looping over a stale count times out; click India directly.
    await dropdown.locator("button").filter({ hasText: /^\s*India\s*$/ }).click();

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator('input.input.txt').nth(1).pressSequentially('123');
    //await page.locator("input[type='text']").nth(4).pressSequentially('Jenifer');
    await page.locator('.field').filter({ hasText: 'Name on Card' }).locator("input[type='text']").pressSequentially('Jenifer');
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderID);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderID.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDeatils = await page.locator(".col-text").textContent();
    expect(orderID.includes(orderIdDeatils)).toBeTruthy();
    //await page.pause();
});