const {test, expect} = require("@playwright/test");

test('@Web Browser context Playwright test',async ({browser})=>
{
    // Chrome-Plugins/cookies
    // const password= page.locator("[type='password']");
    const context = await browser.newContext();
    const page = await context.newPage();
    //page.route('**/*.css', route=> route.abort());      //block it
    const userName= page.locator("#username");      
    const signIn= page.locator("#signInBtn");
    const cardTitles=page.locator(".card-body a");
    page.on('request', request=> console.log(request.url()));
    page.on('response', response=> console.log(response.url(), response.status()));

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //css, (xpath)  [type, fill]- to enter any data in the text box
    await userName.fill("Jenifer Christy");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
        // await password.fill("123456");
        // await page.locator("#signInBtn").click();
    await signIn.click();

        console.log(await page.locator("[style*='block']").textContent());
        await expect(page.locator("[style*='block']")).toContainText('Incorrect');

        await userName.fill("");
         await userName.fill("rahulshettyacademy");
        //  await password.fill("Learning@830$3mK2");
         await signIn.click();
         console.log(await cardTitles.first().textContent());
         console.log(await cardTitles.nth(1).textContent());
         const allTitles= await cardTitles.allTextContents();
         console.log(allTitles);

});

// test('Page Playwright test',async ({page})=>
// {
//     await page.goto("https://google.com");
//     //get title- assertion
//     console.log(await page.title());
//     await expect(page).toHaveTitle("Google");
// });

test('@Web UI Controls', async({page})=>
{
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
const userName= page.locator("#username");
const signIn= page.locator("#signInBtn");
const documentLink= page.locator("[href*='documents-request']");

//dropdown
const dropdown= page.locator("select.form-control");
await dropdown.selectOption("consult");

//radio button
await page.locator(".radiotextsty").last().click();
await page.locator("#okayBtn").click();
console.log(await page.locator(".radiotextsty").last().isChecked());
await expect(page.locator(".radiotextsty").last()).toBeChecked();

//checkboxes- check
await page.locator("#terms").click();
await expect(page.locator("#terms")).toBeChecked(); //returns true

//checkbox-uncheck
await page.locator("#terms").uncheck();
//await page.locator("#terms").isChecked();
expect(await page.locator("#terms").isChecked()).toBeFalsy(); //returns false

//Blinking text
await expect(documentLink).toHaveAttribute("class","blinkingText");
//assertion

//await page.pause();
});

test('Child window handling', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName= page.locator("#username");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink= page.locator("[href*='documents-request']");

    const [newPage]=await Promise.all( //async-> parallely execute-> simultameously
    [
    context.waitForEvent('page'), //Listen for a new page->JS->Promise-> pending,rejected,fullfilled
    documentLink.click(),
    ])  // new page is opened
    
    const text = await newPage.locator(".red").textContent();
    const arrayText= text.split("@")
    const domain= arrayText[1].split(" ")[0]
    //console.log(domain);
    await page.locator("#username").type(domain);
    //await page.pause();
    console.log(await page.locator("#username").inputValue());
});