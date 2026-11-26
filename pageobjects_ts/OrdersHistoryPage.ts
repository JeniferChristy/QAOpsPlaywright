import { test, expect, Locator, Page } from "@playwright/test";

export class OrdersHistoryPage
{
    ordersTable: Locator;
    rows:Locator;
    orderIdDetails:Locator;
    page:Page;

    constructor(page:Page)
    {
        this.page = page;
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderIdDetails = page.locator(".col-text");
    }

    async searchOrderAndSelect(orderId:any)
    {
        await this.ordersTable.waitFor();
        const count = await this.rows.count();
        for (let i = 0; i < count; ++i)
        {
            const rowOrderId = await this.rows.nth(i).locator("th").textContent();
            if (orderId.includes(rowOrderId))
            {
                await this.rows.nth(i).locator("button").first().click();
                break;
            }
        }
    }

    async getOrderId()
    {
        return await this.orderIdDetails.textContent();
    }
}
module.exports = {OrdersHistoryPage};
