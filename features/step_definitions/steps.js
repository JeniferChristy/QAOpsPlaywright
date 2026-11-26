const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber')
const { POManager } = require("../../pageobjects/POManager");
const { expect } = require('@playwright/test');
const { resolveEnv } = require('../../utils/credentials');
const playwright = require('@playwright/test');

setDefaultTimeout(60 * 1000);   // Cucumber's default is 5s per step - too short for browser steps

Given('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {
  username = resolveEnv(username);
  password = resolveEnv(password);
  // Write code here that turns the phrase above into concrete actions

  const loginPage = this.poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.valdLogin(username, password);
});

When('Add {string} to cart', async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is dispalyed in the cart', async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  const cartPage = this.poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();
});

When('Enter valid details and place the order', async function () {
  // Write code here that turns the phrase above into concrete actions
  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await ordersReviewPage.searchcountryAndSelect("ind", "India");
  this.orderId = await ordersReviewPage.SubmitandGetOrderId();
  console.log(this.orderId);
});

Then('verify order is present in the OrderHistory', async function () {
  // Write code here that turns the phrase above into concrete actions
  await this.dashboardPage.navigatetoOrders();
  const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(this.orderId);
  expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});


Given('a login to Ecommerce2 application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {
  username = resolveEnv(username);
  password = resolveEnv(password);
  // Write code here that turns the phrase above into concrete actions
  const userName = this.page.locator("#username");
  const signIn = this.page.locator("#signInBtn");
  await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await this.page.title());

  //css, (xpath)  [type, fill]- to enter any data in the text box
  await userName.fill(username);
  await this.page.locator("[type='password']").fill(password);
  await signIn.click();
});

Then("Verify Error message is dispalyed", async function () {
  console.log(await this.page.locator("[style*='block']").textContent());
  await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');

});    