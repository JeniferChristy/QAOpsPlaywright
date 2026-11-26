const base = require('@playwright/test');
const { env } = require('./credentials');
const { expect, request } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL  = 'https://api.eventhub.rahulshettyacademy.com/api';
const USER = { email: env('EVENTHUB_YAHOO_EMAIL'), password: env('EVENTHUB_YAHOO_PASSWORD') };

exports.test = base.test.extend({

    // Browser page already logged in to EventHub
    authenticatedPage: async ({ page }, use) => {
        await page.goto(`${BASE_URL}/login`);
        await page.getByPlaceholder('you@email.com').fill(USER.email);
        await page.getByLabel('Password').fill(USER.password);
        await page.locator('#login-btn').click();
        await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();   //proves login worked
        await use(page);
    },

    // Creates an event via API, hands it to the test, deletes it afterwards
    createEvent: async ({}, use) => {
        const apiContext = await request.newContext();

        const loginRes = await apiContext.post(`${API_URL}/auth/login`, { data: USER });
        expect(loginRes.ok(), `Login failed: ${await loginRes.text()}`).toBeTruthy();
        const { token } = await loginRes.json();
        const headers = { Authorization: `Bearer ${token}` };

        const eventDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();   //30 days ahead
        const eventRes = await apiContext.post(`${API_URL}/events`, {
            headers,
            data: {
                title:       `Playwright Event ${Date.now()}`,   //unique title so the test finds exactly this event
                description: 'Event created by Playwright fixture',
                category:    'Conference',
                venue:       'Test Venue',
                city:        'Chennai',
                eventDate,
                price:       100,
                totalSeats:  50,
                imageUrl:    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800',
            },
        });
        expect(eventRes.ok(), `Create event failed: ${await eventRes.text()}`).toBeTruthy();
        const event = (await eventRes.json()).data;

        await use(event);

        //tear down: remove the event so test data doesn't pile up
        await apiContext.delete(`${API_URL}/events/${event.id}`, { headers });
        await apiContext.dispose();
    },
});

exports.expect = expect;
