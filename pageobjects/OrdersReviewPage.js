const { expect } = require('@playwright/test');

class OrdersReviewPage
{
    constructor(page)
    {
        this.page = page;
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.cvv = page.locator('input.input.txt').nth(1);
        this.nameOnCard = page.locator('.field').filter({ hasText: 'Name on Card' }).locator("input[type='text']");
        this.submit = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async searchcountryAndSelect(countryCode, countryName)
    {
        // short delay: a long per-key delay leaves an orphaned .ta-backdrop that blocks Place Order
        await this.country.pressSequentially(countryCode, { delay: 150 });
        await this.dropdown.locator('button').filter({ hasText: new RegExp(`^\\W*${countryName}$`) }).click();
        await expect(this.dropdown).toBeHidden();
    }

    async SubmitandGetOrderId()
    {
        await this.cvv.fill('123');
        await this.nameOnCard.fill('Jenifer');
        await this.submit.click();
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        return await this.orderId.textContent();
    }
}
module.exports = {OrdersReviewPage};
