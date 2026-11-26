class DashboardPage{
    constructor(page){
        this.products = page.locator(".card-body");
        this.productsText= page.locator(".card-body b");
        this.cart= page.locator("[routerlink*='cart']")
        this.orders= page.locator("button[routerlink*='myorders']");

    }
    async searchProductAddCart(productName){
        await this.productsText.first().waitFor();     // wait for products to load before reading them
        const titles = await this.productsText.allTextContents();
            console.log(titles);
            const count = await this.products.count();
            for (let i = 0; i < count; ++i) {
                const title = await this.products.nth(i).locator("b").textContent();
                if (title.trim().toLowerCase() === productName.trim().toLowerCase()) {
                    //add to cart
                    await this.products.nth(i).locator("text= Add To Cart").click();
                    return;
                }
            }
            throw new Error(`Product "${productName}" not found. Available: ${titles.join(", ")}`);
    }

    async navigateToCart()
    {
          await this.cart.click();
    }

    async navigatetoOrders()
    {
          await this.orders.click();
    }
}
module.exports= {DashboardPage};