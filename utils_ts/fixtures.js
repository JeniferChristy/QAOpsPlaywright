const base = require('@playwright/test');
const { env } = require('../utils/credentials');
const {expect, request} = base;
const { ApiUtils } = require('./ApiUtils');

const loginPayLoad ={userEmail:env('ECOM_EMAIL'),userPassword:env('ECOM_PASSWORD')};
const orderPayload ={orders:[{country:"India",productOrderedId:"6960eac0c941646b7a8b3e68"}]};

// Rahul Shetty Academy client app fixtures (used by fixturesDemo.spec.js)
exports.customtest = base.test.extend(
    {
    authenticatedPage : async({page}, use) =>
    {
        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("#userEmail").fill(loginPayLoad.userEmail);
        await page.locator("#userPassword").fill(loginPayLoad.userPassword);
        await page.locator("[value='Login']").click();
        await page.locator(".card-body b").first().waitFor();    //proves login worked before handing the page to the test
        await use(page);
        // no teardown needed: Playwright closes the built-in page itself
    },

    createOrder : async({}, use)=>
    {
        const apiContext =  await request.newContext();
        const apiUtils = new ApiUtils(apiContext, loginPayLoad);
        const response = await apiUtils.createOrder(orderPayload);
        await use(response);
        await apiContext.dispose();
    },

    testDataForOrder : {
        productName: 'ADIDAS ORIGINAL'
    }
});

// EventHub fixtures

const LOGIN_URL = 'https://eventhub.rahulshettyacademy.com/login';
const API_BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';

const credentials = {
  email: env('EVENTHUB_YAHOO_EMAIL'),
  password: env('EVENTHUB_YAHOO_PASSWORD'),
};

exports.test = base.test.extend({

  // Task 1: UI login fixture — returns an already-authenticated page
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(LOGIN_URL);
    await page.locator('#email').fill(credentials.email);
    await page.locator('#password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Featured Events')).toBeVisible();

    await use(page);
    await context.close();
  },

  // Task 2: API event-creation fixture — returns the created event's data
  createEvent: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({ baseURL: API_BASE_URL });

    // confirmed response shape: { success, token, user: { id, email } }
    const loginRes = await apiContext.post('/api/auth/login', { data: credentials });
    const loginBody = await loginRes.json();
    const token = loginBody.token;

    const eventPayload = {
      title: `Automation Test Event ${Date.now()}`,
      description: 'Created by an automated Playwright fixture for testing.',
      category: 'Conference',
      venue: 'Bangalore International Centre',
      city: 'Bangalore',
      eventDate: '2026-09-15T09:00:00.000Z',
      price: 1500,
      totalSeats: 500,
      imageUrl: 'https://example.com/images/automation-event.jpg',
    };

    const createRes = await apiContext.post('/api/events', {
      data: eventPayload,
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await createRes.json();
    const event = body.data; // event object is nested under "data"

    await use(event);

    // teardown — clean up the event after the test finishes
    await apiContext.delete(`/api/events/${event.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await apiContext.dispose();
  },
});

exports.expect = expect;