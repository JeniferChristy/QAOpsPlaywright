import{test, expect} from '@playwright/test';
const BASE_URL      = 'https://eventhub.rahulshettyacademy.com/login';
// ── Credentials 
import { env } from '../utils/credentials';
const USER_EMAIL    = env('EVENTHUB_QA_EMAIL');
const USER_PASSWORD = env('EVENTHUB_QA_PASSWORD');

test('Single ticket booking is eligible for refund',async ({page})=>
{
    //Step1-Login
    await page.goto(BASE_URL);
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel("password").fill(USER_PASSWORD);
    await page.locator("button[id='login-btn']").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

    //Step 2 — Book first event with 1 ticket (default)
    //await loginAndGoToBooking(page);

    await page.goto("https://eventhub.rahulshettyacademy.com");
    await page.getByTestId('event-card').filter({ hasNotText: 'Sold Out' }).first().getByTestId('book-now-btn').click(); // skip sold-out events

    await page.getByLabel('Full Name').fill('Jenifer');
    await page.getByPlaceholder('you@email.com').fill('jeni@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
    await page.locator('#confirm-booking').click();

    await page.getByRole('link', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    await page.getByRole('link', {name:'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    const bookingRef= (await page.locator('span.font-mono.font-bold').first().innerText()).trim();
    const eventTitle= (await page.locator('h1').innerText()).trim();
    expect(bookingRef.charAt(0), `Booking ref "${bookingRef}" should start with first letter of "${eventTitle}"`).toBe(eventTitle.charAt(0));
    await page.locator('#check-refund-btn').click();

    await expect(page.locator('#refund-spinner')).toBeVisible({ timeout: 6000 });

    const result= page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');

});

test(' Group ticket booking is NOT eligible for refund',async ({page})=>
{
     await page.goto(BASE_URL);
     await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel("password").fill(USER_PASSWORD);
    await page.locator("button[id='login-btn']").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

    
    //await loginAndGoToBooking(page);

    await page.goto("https://eventhub.rahulshettyacademy.com");
    await page.getByTestId('event-card').filter({ hasNotText: 'Sold Out' }).first().getByTestId('book-now-btn').click(); // skip sold-out events
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await page.getByLabel('Full Name').fill('Jenifer');
    await page.getByPlaceholder('you@email.com').fill('jeni@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
    await page.locator('#confirm-booking').click();

    await page.getByRole('link', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    await page.getByRole('link', {name:'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    const bookingRef= (await page.locator('span.font-mono.font-bold').first().innerText()).trim();
    const eventTitle= await page.locator('h1').innerText();
    expect(bookingRef.charAt(0), `Booking ref "${bookingRef}" should start with first letter of "${eventTitle}"`).toBe(eventTitle.charAt(0));
    await page.locator('#check-refund-btn').click();

    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

    const result= page.locator("#refund-result");
    await expect(result).toBeVisible();
    await expect(result).toContainText("Not eligible for refund");
    await expect(result).toContainText("Group bookings (3 tickets) are non-refundable");



});