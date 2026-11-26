import { test, expect, Locator, Page } from "@playwright/test";
export class CartPage
{
    cartProducts: Locator;
    checkoutButton:Locator;
    page:Page;

    constructor(page:Page)
    {
        this.page = page;
        this.cartProducts = page.locator("div li h3");
        this.checkoutButton = page.locator("text=Checkout");
    }

    async VerifyProductIsDisplayed(productName:string)
    {
        await expect(this.cartProducts.filter({ hasText: productName })).toBeVisible();
    }

    async Checkout()
    {
        await this.checkoutButton.click();
    }
}
module.exports = {CartPage};
