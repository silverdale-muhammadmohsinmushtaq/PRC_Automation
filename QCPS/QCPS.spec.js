require('dotenv').config();
const { test, expect } = require('@playwright/test');

let page;

test.describe.serial('Odoo End-to-End QA', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(process.env.SERVER_LINK);
    await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
    await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await page.getByRole('button', { name: 'User' }).waitFor();
    
  });

	test('Verify the user can create "Company" Type contact', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.click('//*[@id="result_app_21"]/img');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
		await page.getByText('Upload your file').click();
  		await page.getByRole('dialog').setInputFiles('TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
  		await page.locator('button[name="import_from_csv"]').click();
  		await page.getByRole('button', { name: 'Close' }).click();
	});

	


	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});

