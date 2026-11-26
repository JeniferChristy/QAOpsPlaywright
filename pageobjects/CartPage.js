const { expect } = require('@playwright/test');

class CartPage
{
    constructor(page)
    {
        this.page = page;
        this.cartProducts = page.locator("div li h3");
        this.checkoutButton = page.locator("text=Checkout");
    }

    async VerifyProductIsDisplayed(productName)
    {
        await expect(this.cartProducts.filter({ hasText: productName })).toBeVisible();
    }

    async Checkout()
    {
        await this.checkoutButton.click();
    }
}
module.exports = {CartPage};
