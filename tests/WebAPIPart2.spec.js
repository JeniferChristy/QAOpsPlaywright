const { test, expect } = require("@playwright/test");
const { env } = require('../utils/credentials');
let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(env('ECOM_EMAIL'));
    await page.locator("#userPassword").fill(env('ECOM_PASSWORD'));
    await page.locator("[value='Login']").click();
    await page.locator(".card-body b").first().waitFor();           //proves login worked before saving the session
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
})

test('Practice Login Page and Title', async () => {
    const email = env('ECOM_EMAIL');
    const productName = 'ZARA COAT 3'
    const page = await webContext.newPage();               //reuses the logged-in session from beforeAll
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();    //allTextContents() doesn't wait


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
    await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 1000 });
    const dropdown = page.locator(".ta-results");
    await expect(dropdown.locator("button").filter({ hasNotText: /ind/i })).toHaveCount(0);    //wait until the list is filtered for "ind", not a stale "in" list
    await dropdown.locator("button").filter({ hasText: /^\s*India\s*$/ }).click();             //exact "India", skips "British Indian Ocean Territory"

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
test('@API Test case 2', async () => {
    const email = env('ECOM_EMAIL');
    const productName = 'ZARA COAT 3'
    const page = await webContext.newPage();               //reuses the logged-in session from beforeAll
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();    //allTextContents() doesn't wait


    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
});