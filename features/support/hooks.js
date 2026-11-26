const { Before, After, Status, BeforeStep, AfterStep } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
const { POManager } = require("../../pageobjects/POManager");

Before(async function () {
    this.browser = await playwright.chromium.launch(
        {
            headless: false
        }
    );

    const context = await this.browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
});

BeforeStep(function () {

});

AfterStep(async function ({ result }) {
    if (result.status === Status.FAILED) {
        await this.page.screenshot({ path: 'screenshot1.png' });
    }


});

After(async function () {
    console.log("I am last");
    if (this.browser) await this.browser.close();
});