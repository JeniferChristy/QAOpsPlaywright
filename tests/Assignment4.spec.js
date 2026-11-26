import { test, expect } from '@playwright/test';
import { env } from '../utils/credentials';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL  = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = { email: env('EVENTHUB_YAHOO_EMAIL'), password: env('EVENTHUB_YAHOO_PASSWORD') };
const GMAIL_USER = { email: env('EVENTHUB_GMAIL_EMAIL'), password: env('EVENTHUB_GMAIL_PASSWORD') };

async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}
test('gmail user sees Access Denied when viewing yahoo user booking', async ({ page, request }) => {

  // ── Step 1: Login as Yahoo user via API and get token ─────────────────────
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { email: YAHOO_USER.email, password: YAHOO_USER.password },
  });
  expect(loginRes.ok(), `Yahoo login failed: ${await loginRes.text()}`).toBeTruthy();   //no token -> every later API call fails
  const { token } = await loginRes.json();

  // ── Step 2: Fetch events via API to get a valid event ID ──────────────────
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(eventsRes.ok()).toBeTruthy();
  const eventsData = await eventsRes.json();
  const event = eventsData.data.find(e => e.availableSeats > 0); // skip sold-out events
  expect(event, 'No event with free seats').toBeTruthy();
  const eventId = event.id;

  // ── Step 3: Create a booking via API as Yahoo user ────────────────────────
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      eventId,
      customerName:  'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '9999999999',
      quantity:      1,
    },
  });
  expect(bookingRes.ok(), `Booking failed: ${await bookingRes.text()}`).toBeTruthy();
  const yahooBookingId = (await bookingRes.json()).data.id;

  console.log(`Yahoo booking created via API. ID: ${yahooBookingId}`);

  // ── Step 4: Login as Gmail user via UI ────────────────────────────────────
  await loginAs(page, GMAIL_USER);

  // ── Step 5: Navigate directly to Yahoo's booking URL as Gmail user ────────
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { waitUntil: 'networkidle' });

  // ── Step 6: Validate Access Denied ───────────────────────────────────────
  await expect(page.getByText('Access Denied')).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();
});