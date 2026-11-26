const {test, expect} = require("@playwright/test");

test('Practice special Locators',async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByPlaceholder("Password").pressSequentially("123456");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByRole("Button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    //5 seconds default timeout fro expect assertions- timeout 10seconds will overcome default 5seconds timer - (step level)
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).isVisible({timeout: 10_0000}); 

    await page.getByRole("link",{name:"Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();


});

test('Practice Test Level time out',async ({page})=>
{
    test.setTimeout(60000); //1 minute timeout
    const slowtime= expect.configure({timeout: 9000});//test-level- 9second
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByPlaceholder("Password").pressSequentially("123456");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByRole("Button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    //5 seconds default timeout fro expect assertions- timeout 10seconds will overcome default 5seconds timer - (step level)
    await slowtime(page.getByText("Success! The Form has been submitted successfully!.")).isVisible({timeout: 10_0000}); 

    await page.getByRole("link",{name:"Shop"}).click();
    await slowtime(page.locator(".my-4").first()).toHaveText("Shop");

    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();


});