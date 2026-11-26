const { test, expect } = require('@playwright/test');
const { resolveEnv } = require('../utils/credentials');
const{customtest}= require('../utils/test-base');


const {POManager}= require('../pageobjects/POManager');

const dataset= resolveEnv(require("../utils/placeorderTestData.json"));

for(const data of dataset)
{
test(`@Web App Login Page and Title for ${data.productName}`, async ({ page }) => {

    const poManager= new POManager(page);
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.valdLogin(data.username,data.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage =poManager.getOrdersReviewPage();
    await ordersReviewPage.searchcountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitandGetOrderId();
    console.log(orderId);
    
    await dashboardPage.navigatetoOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});
}

customtest(`App Login Page`, async ({page, testDataForOrder}) => {

    const poManager= new POManager(page);
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.valdLogin(testDataForOrder.username,testDataForOrder.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();

});