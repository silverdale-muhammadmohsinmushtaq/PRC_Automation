require('dotenv').config();
import { handleRepairShopWorkcenterPopup, scanInRepairShop } from './utils/popup';
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

let packageValue = "";



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
		await page.click('button[name="action_fail"]');
		await page.waitForTimeout(2000);
		// await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
		// await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		// await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		// await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		// await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
		// await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
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
		await page.click('button[name="action_fail"]');
		await page.waitForTimeout(2000);
		// await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
		// await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
		// await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		// await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
		// await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
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
		await page.click('button[name="button_validate"]');
		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14342 Verify the locations are correct in "In bound Manifest" transfer created in importing Manifest file in Amazon module', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('button', { name: 'Remove' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).first().click();
		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/In Transit/);

	});

	test('QCP14382 Verify the Amazon Status Code for LPN is "CRT" when user imports the Inbound Manifest File', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('button', { name: 'Remove' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
		await expect(page.locator('input#amazon_status_code_0')).toHaveValue(/CRT/);
	});

	test('QCP14338 Verify that repair orders are in draft stage when user imports the inbound manifest file', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Repairs' }).click();
  		await page.getByRole('button', { name: 'Remove' }).click();
  		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
  		await page.getByRole('cell', { name: lpnArray[0] }).first().click();
		await expect.soft(page.locator('button[data-value="draft"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14264 + QCP14345 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation + Verify the user can Add a product and validate the "Receipt" internal transfer in barcode module', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
		await page.getByRole('button', { name: 'Operations' }).click();
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[0]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[1]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[2]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[3]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[4]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[5]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[6]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(30000);
		await page.click('button.o_validate_page.btn.btn-primary');
		await page.waitForTimeout(30000);
		await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
	});

	test('QCP14346 Verify the scanned LPN shall go to "Receiving" location on validating the "Receipts" transfer', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('button', { name: 'Remove' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/Receiving/);
	});

	test('QCP14294 Verify the repair order is auto confirmed when the LPN Reaches the "Receiving Location', async ({ page }) => {
  		await page.goto(process.env.SERVER_LINK);
    	await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
    	await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
    	await page.getByRole('button', { name: 'Log in', exact: true }).click();
		await page.goto("https://prcstaging.silverdale.us/odoo/crons?debug=1");
  		await page.getByRole('searchbox', { name: 'Search...' }).click();
  		await page.getByRole('searchbox', { name: 'Search...' }).fill('Automatically Confirm Repair Orders');
  		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
  		await page.getByRole('cell', { name: 'Automatically Confirm Repair' }).click();
  		await page.getByRole('button', { name: 'Run Manually' }).click();
		await page.waitForTimeout(70000);
  		await page.goto('https://prcstaging.silverdale.us/web');
  		await page.getByRole('option', { name: 'Repairs' }).click();
  		await page.getByRole('button', { name: 'Remove' }).click();
  		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
  		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
  		await page.getByRole('cell', { name: lpnArray[0] }).click();
  		await expect.soft(page.locator('button[data-value="confirmed"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
	});

	test('QCP14343 Verify that user can create new "Receipt" operation for NC wareshouse', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
		await page.getByRole('button', { name: 'Operations' }).click();
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(20000);
	});

	test('QCP14383 Verify the "Amazon Status code" on the LPN is "ARV" after validating the "Receipt" Operation in Barcode', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('button', { name: 'Remove' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
		await expect.soft(page.locator('input#amazon_status_code_0')).toHaveValue(/ARV/);
	});

	test('QCP14389 Verify the user can export the "Transshipment Acknowledgement" report from "Amazon" module when the LPN is in "Receiving" location', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Amazon' }).click();
  		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[2]/div/div[2]/div/div/button');
  		await page.getByRole('combobox', { name: 'Manifest' }).click();
  		await page.waitForTimeout(5000);
  		await page.getByRole('combobox', { name: 'Manifest' }).press('Enter');
  		const page2Promise = page.waitForEvent('popup');
  		const download1Promise = page.waitForEvent('download');
  		await page.locator('button[name="generate_csv"]').click();
  		const page2 = await page2Promise;
  		const download1 = await download1Promise;
	});

	test('QCP14347 + QCP07406 Verify the user can create and validate the "Sorting" internal transfer in barcode + Verify product can be put in pack', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
        await page.getByRole('button', { name: 'Operations' }).click();
        
        await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[6]/div/div[1]/span[2]');
        await page.waitForTimeout(30000);
        await page.getByRole('button', { name: 'New' }).click();
        await page.waitForTimeout(30000);
        await page.keyboard.type(lpnArray[0]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[1]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[2]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[3]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[4]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[5]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(lpnArray[6]);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
        await page.click('xpath=/html/body/div[1]/div/footer/button[2]');
        await page.waitForTimeout(30000);
		packageValue = await page.locator('span.result-package').first().textContent();
		packageValue = packageValue.trim();
        await page.click('xpath=/html/body/div[1]/div/footer/button[3]');
        await page.waitForTimeout(30000);
        await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
	});

	test('QCP14348 Verify the product shall go to "Sorting" location on validating the "Sorting" operation in barcode ', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
		await page.getByRole('button', { name: 'Remove' }).click();
		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
		await page.getByRole('cell', { name: lpnArray[0] }).click();
		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/Sorting/);
	});

	test('Verify the Work Orders and Quality Checks are Created on Repair when confirmed ', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Repairs' }).click();
  		await page.getByRole('button', { name: 'Remove' }).click();
  		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
  		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
  		await page.getByRole('cell', { name: lpnArray[0] }).click();
  		await expect.soft(page.locator('button[data-value="confirmed"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
		await expect(page.locator('button[name="action_open_quality_checks"]')).toBeVisible();
		await expect(page.locator('tr.o_data_row.o_row_draggable').first()).toBeVisible();
	});

	test('QCP14344 Verify the user can create "New" transfer for NV warehouse in Barcode', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
		await page.getByRole('button', { name: 'Operations' }).click();
		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
		await page.getByRole('button', { name: 'New' }).click();
		await page.waitForTimeout(20000);
	});


	test('QCP14351 Verify the user can perform the "Move Pallet" operation', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
        await page.getByRole('button', { name: 'Operations' }).click();
        
        await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[11]/div/div[1]');
        await page.waitForTimeout(30000);
        await page.getByRole('button', { name: 'New' }).click();
        await page.waitForTimeout(30000);
        await page.keyboard.type("NV-SORTING");
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type(packageValue);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
		await page.keyboard.type("PPI1-FL-ROW-10");
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
        await page.click('button.o_validate_page.btn.btn-primary');
        await page.waitForTimeout(30000);
        await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
	});

	//////////////////////////////////////////////
	test('QCP14350 Verify the user can perform the "Move Pallet to Repair Line" operation in Barcode', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByRole('option', { name: 'Barcode' }).click();
        await page.getByRole('button', { name: 'Operations' }).click();
                
        await page.getByText('NV: Move Pallet to Repair Line', { exact: true }).click();
        await page.waitForTimeout(20000);
        await page.getByRole('button', { name: 'New' }).click();
        await page.waitForTimeout(30000);
        await page.keyboard.type("PPI1-FL-ROW-10");
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
        await page.keyboard.type(packageValue);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
        await page.keyboard.type("PPI1-FL-ROW-10");
        await page.keyboard.press('Enter');
        await page.waitForTimeout(20000);
        await page.click('button.o_validate_page.btn.btn-primary');
        await page.waitForTimeout(30000);
        await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
	});


	test('Verify the user can search the LPN in Repair Shop', async ({page}) => {
        await page.goto(process.env.SERVER_LINK);
        await page.getByText('Repair Shop', { exact: true }).click();
		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox.click();
		await searchBox.fill(lpnArray[1]);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(20000);
		

	});



	/////////////////////////////////////////////


	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});



