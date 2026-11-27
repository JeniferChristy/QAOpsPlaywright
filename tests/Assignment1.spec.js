import {test, expect} from '@playwright/test';
const BASE_URL      = 'https://eventhub.rahulshettyacademy.com/login';
// ── Credentials 
import { env } from '../utils/credentials';
const USER_EMAIL    = env('EVENTHUB_QA_EMAIL');
const USER_PASSWORD = env('EVENTHUB_QA_PASSWORD');

test('Assignment Login Page',async ({page})=>
{
    //Step1-Login
    await page.goto(BASE_URL);
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel("password").fill(USER_PASSWORD);
    await page.locator("button[id='login-btn']").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

    //Step2-Create a new event
    
    await page.getByRole('link', { name: 'Manage Events' }).click();
    //await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' });
    const eventTitle = `Test Event ${Date.now()}`;

    await page.locator("#event-title-input").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill("This is for the Testing purpose only. Kindly dont use!!!!");
    await page.getByLabel("city").fill("Coimbatore");
    await page.getByLabel("venue").fill("SPR Gardens");
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // form only accepts future dates
    await page.getByLabel("Event Date & Time").fill(`${futureDate}T09:15`);
    await page.getByRole('spinbutton', { name: 'Price ($)*' }).fill('60');
    await page.getByLabel("Total Seats").fill('50');
    await page.locator('#add-event-btn').click();
     await expect(page.getByText('Event created!')).toBeVisible();

  console.log(`Created event: "${eventTitle}"`);

  //Step 3 — Find the event card and capture seats
  await page.goto("https://eventhub.rahulshettyacademy.com/");
    const eventCards= page.getByTestId('event-card');
    await expect(eventCards.first()).toBeVisible();
    const targetCard= eventCards.filter({hasText: eventTitle}).first();
    await expect(targetCard).toBeVisible({timeout:5000});
    const seatsBeforeBooking= parseInt(await targetCard.getByText('seat').first().innerText());
    console.log('Seats before booking: ${seatBeforeBooking}');
    await targetCard.getByTestId('book-now-btn').click();

    //Step 4: Fill the booking form
    const ticketCount= page.locator("#ticket-count");
    await expect(ticketCount).toHaveText('1');

    await page.getByLabel('Full Name').fill('Jenifer');
    await page.getByPlaceholder('you@email.com').fill('jeni@gmail.com');
    await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
    await page.locator('#confirm-booking').click();


    //Step5-Verify booking confirmation
    const bookingRef1= page.locator('.booking-ref').first();
    await expect(bookingRef1).toBeVisible();

    const bookingRef= (await bookingRef1.innerText()).trim();
    expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());

    console.log('Booking Confimed. Ref: ${Booking Ref}');

    //Step6- Verify in My Bookings

    await page.getByRole('link',{name:'View My Bookings'}).click();
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');

    const bookingCards= await page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();

    const matchingCards= bookingCards.filter({has: page.locator('.booking-ref', {hasText: bookingRef}) });
    await expect(matchingCards).toBeVisible();

    await expect(matchingCards).toContainText(eventTitle);

    //Step 7 — Verify seat reduction
    await page.goto("https://eventhub.rahulshettyacademy.com/events");
    await expect(eventCards.first()).toBeVisible();

    const updateCard= eventCards.filter({hasText: eventTitle}).first();
    await expect(updateCard).toBeVisible();

    const seatsAfterBooking= parseInt(await updateCard.getByText('seat').first().innerText());
    console.log('Seats after booking: ${seatsAfterBooking}');

    await expect(seatsAfterBooking === seatsAfterBooking -1);


});