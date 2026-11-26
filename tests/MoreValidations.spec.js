const {test, expect}=require('@playwright/test');

//test.describe.configure({mode:'parallel'});             //run this test file in parallel
//test.describe.configure({mode:"serial"});               //run in serial, once any test is failed, it skips the remainings tests
test("@Web Popup validations", async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();

    //handle dropdown
    //await page.pause();
    page.on('dialog',dialog => dialog.accept());   //dismiss
    await page.locator("#confirmbtn").click();
  
    //hover
    await page.locator("#mousehover").hover();

    //frames
    const framesPage= page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck= await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
});

test("Screenshot and visual comparision", async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:'partialscreenshot.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:'screenshot.png'});

    await expect(page.locator("#displayed-text")).toBeHidden();
});

test('visual', async({page})=>
{
    // await page.goto("https://flightaware.com/");
     await page.goto("https://google.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});