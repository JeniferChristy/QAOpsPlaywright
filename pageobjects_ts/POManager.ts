//const {LoginPage} = require('./LoginPage');
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { CartPage } from "./CartPage";
import { OrdersHistoryPage } from "./OrdersHistoryPage";
import { OrdersReviewPage } from "./OrdersReviewPage";
import { Page } from "@playwright/test";


export class POManager
{
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    cartPage: CartPage;
    ordersReviewPage: OrdersReviewPage;
    ordersHistoryPage:OrdersHistoryPage;
    page:Page;

    constructor(page:Page)
    {
        this.page= page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.ordersReviewPage = new OrdersReviewPage(page);
        this.ordersHistoryPage = new OrdersHistoryPage(page);
    }
    getLoginPage()
    {
        return this.loginPage;
    }
    getDashboardPage()
    {
        return this.dashboardPage;
    }
    getCartPage()
    {
        return this.cartPage;
    }
    getOrdersReviewPage()
    {
        return this.ordersReviewPage;
    }
    getOrdersHistoryPage()
    {
        return this.ordersHistoryPage;
    }
}
module.exports= {POManager};
