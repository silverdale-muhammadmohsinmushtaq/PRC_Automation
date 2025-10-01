require('dotenv').config();
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function getLPNsFromManifest(manifestPath) {
  const lpnArray = [];
  const csvData = fs.readFileSync(manifestPath, 'utf8');
  const lines = csvData.split('\n');
  for (let i = 2; i < lines.length; i++) { // start from third row
    const cols = lines[i].split(',');
    if (cols[0]) {
      lpnArray.push(cols[0].trim());
    }
  }
  return lpnArray;
}
const manifestFilePath = path.join(__dirname, '../ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
const lpnArray = getLPNsFromManifest(manifestFilePath);



let page;

test.describe.serial('Odoo End-to-End QA', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(process.env.SERVER_LINK);
    await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
    await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    
  });

	test('QCP10993 Verify user can import manifest file in amazon edi', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.click('//*[@id="result_app_21"]/img');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
		await page.getByText('Upload your file').click();
		//await page.pause();
	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
  		await page.locator('button[name="import_from_csv"]').click();
  		await page.getByRole('button', { name: 'Close' }).click();
		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
		await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14340 Verify that transfer with "In Bound Manifest" shall be created on importing the Manifest file in Amazon module', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.click('//*[@id="result_app_21"]/img');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
		await page.getByText('Upload your file').click();
		//await page.pause();
	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
  		await page.locator('button[name="import_from_csv"]').click();
  		await page.getByRole('button', { name: 'Close' }).click();
		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
		await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14342 Verify the locations are correct in "In bound Manifest" transfer created in importing Manifest file in Amazon module', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.click('//*[@id="result_app_21"]/img');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
		await page.getByText('Upload your file').click();
		//await page.pause();
	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
  		await page.locator('button[name="import_from_csv"]').click();
  		await page.getByRole('button', { name: 'Close' }).click();
		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
		//await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/In Transit/);

	});

	test('QCP14341 Verify the user can validate the "In Bound Manifest" transfer created on importing manifest file in amazon', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.click('//*[@id="result_app_21"]/img');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
		await page.getByText('Upload your file').click();
		//await page.pause();
	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
  		await page.locator('button[name="import_from_csv"]').click();
  		await page.getByRole('button', { name: 'Close' }).click();
		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
		await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14382 Verify the Amazon Status Code for LPN is "CRT" when user imports the Inbound Manifest File', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await expect(page.locator('input#amazon_status_code_0')).toHaveValue(/CRT/);
	});

	test('QCP14338 Verify that repair orders are in draft stage when user imports the inbound manifest file', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Repairs' }).click();
  		await page.getByRole('button', { name: 'Remove' }).click();
  		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
  		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
  		await page.getByRole('link', { name: 'Search LPN for:'+lpnArray[0] }).click();
  		await page.getByRole('cell', { name: lpnArray[0] }).click();
	});




	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});

