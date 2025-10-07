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

// 	test('QCP10993 Verify user can import manifest file in amazon edi', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.click('//*[@id="result_app_21"]/img');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
// 		await page.getByText('Upload your file').click();
// 		//await page.pause();
// 	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
//   		await page.locator('button[name="import_from_csv"]').click();
//   		await page.getByRole('button', { name: 'Close' }).click();
// 		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
// 		await page.click('button[name="action_fail"]');
// 		await page.waitForTimeout(2000);
		
// 	});

// 	test('QCP14340 Verify that transfer with "In Bound Manifest" shall be created on importing the Manifest file in Amazon module', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.click('//*[@id="result_app_21"]/img');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
// 		await page.getByText('Upload your file').click();
// 		//await page.pause();
// 	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
//   		await page.locator('button[name="import_from_csv"]').click();
//   		await page.getByRole('button', { name: 'Close' }).click();
// 		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
// 		await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
// 		await page.click('button[name="action_fail"]');
// 		await page.waitForTimeout(2000);
		
// 	});


// 	test('QCP14341 Verify the user can validate the "In Bound Manifest" transfer created on importing manifest file in amazon', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.click('//*[@id="result_app_21"]/img');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[1]/div/div[2]/div/div/button');
// 		await page.getByText('Upload your file').click();
// 		//await page.pause();
// 	    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles('ManifestFile/TUS1_RPNV_0880885f-9691-45b0-a3a3-e060b96b5d53.csv');
//   		await page.locator('button[name="import_from_csv"]').click();
//   		await page.getByRole('button', { name: 'Close' }).click();
// 		await page.click('xpath=/html/body/header/nav/div[2]/a[2]');
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]');
// 		await expect.soft(page.locator('button[data-value=\"draft\"][aria-current=\"step\"]')).toHaveAttribute('aria-checked', 'true');
// 		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[1]/div[1]/button[1]')
// 		await page.waitForSelector('button[data-value="done"][aria-current="step"]', { timeout: 100000 });
// 		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
// 		await page.click('xpath=/html/body/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div/a/span')
// 		await page.click('button[name="button_validate"]');
// 		await expect.soft(page.locator('button[data-value="done"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
// 	});

// 	test('QCP14342 Verify the locations are correct in "In bound Manifest" transfer created in importing Manifest file in Amazon module', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
// 		await page.getByRole('cell', { name: lpnArray[0] }).first().click();
// 		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/In Transit/);

// 	});

// 	test('QCP14382 Verify the Amazon Status Code for LPN is "CRT" when user imports the Inbound Manifest File', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
// 		await page.getByRole('cell', { name: lpnArray[0] }).click();
// 		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
// 		await expect(page.locator('input#amazon_status_code_0')).toHaveValue(/CRT/);
// 	});

// 	test('QCP14338 Verify that repair orders are in draft stage when user imports the inbound manifest file', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Repairs' }).click();
//   		await page.getByRole('button', { name: 'Remove' }).click();
//   		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
//   		await page.getByRole('cell', { name: lpnArray[0] }).first().click();
// 		await expect.soft(page.locator('button[data-value="draft"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
// 	});

// 	test('QCP14264 + QCP14345 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation + Verify the user can Add a product and validate the "Receipt" internal transfer in barcode module', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
// 		await page.getByRole('button', { name: 'Operations' }).click();
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
// 		await page.getByRole('button', { name: 'New' }).click();
// 		await page.waitForTimeout(30000);
// 		await expect.soft(page.locator('xpath=/html/body/div[1]/div/header/div[2]/div/span[2]')).toBeVisible();
		
// 		await page.keyboard.type(lpnArray[0]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(10000);
// 		await page.keyboard.type(lpnArray[1]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[2]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[3]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[4]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[5]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[6]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(5000);
// 		await page.click('button.o_validate_page.btn.btn-primary');
// 		await page.waitForTimeout(20000);
// 		await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
// 	});

// 	test('QCP14346 Verify the scanned LPN shall go to "Receiving" location on validating the "Receipts" transfer', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
// 		await page.getByRole('cell', { name: lpnArray[0] }).click();
// 		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
// 		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/Receiving/);
// 	});

// 	test('QCP14294 Verify the repair order is auto confirmed when the LPN Reaches the "Receiving Location', async ({ page }) => {
//   		await page.goto(process.env.SERVER_LINK);
//     	await page.locator("//input[@name='login']").fill(process.env.ODOO_USERNAME);
//     	await page.locator("//input[@name='password']").fill(process.env.ODOO_PASSWORD);
//     	await page.getByRole('button', { name: 'Log in', exact: true }).click();
// 		await page.goto("https://prcstaging.silverdale.us/odoo/crons?debug=1");
//   		await page.getByRole('searchbox', { name: 'Search...' }).click();
//   		await page.getByRole('searchbox', { name: 'Search...' }).fill('Automatically Confirm Repair Orders');
//   		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
//   		await page.getByRole('cell', { name: 'Automatically Confirm Repair' }).click();
//   		await page.getByRole('button', { name: 'Run Manually' }).click();
// 		await page.waitForTimeout(70000);
//   		await page.goto('https://prcstaging.silverdale.us/web');
//   		await page.getByRole('option', { name: 'Repairs' }).click();
//   		await page.getByRole('button', { name: 'Remove' }).click();
//   		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
//   		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
//   		await page.getByRole('cell', { name: lpnArray[0] }).click();
//   		await expect.soft(page.locator('button[data-value="confirmed"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
// 	});

// 	test('QCP14343 Verify that user can create new "Receipt" operation for NC wareshouse', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
// 		await page.getByRole('button', { name: 'Operations' }).click();
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
// 		await page.getByRole('button', { name: 'New' }).click();
// 		await page.waitForTimeout(20000);
// 	});

// 	test('QCP14383 Verify the "Amazon Status code" on the LPN is "ARV" after validating the "Receipt" Operation in Barcode', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
// 		await page.getByRole('cell', { name: lpnArray[0] }).click();
// 		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
// 		await expect.soft(page.locator('input#amazon_status_code_0')).toHaveValue(/ARV/);
// 	});

// 	test('QCP14389 Verify the user can export the "Transshipment Acknowledgement" report from "Amazon" module when the LPN is in "Receiving" location', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Amazon' }).click();
//   		await page.click('xpath=/html/body/div[1]/div/div[2]/div/div[1]/article[2]/div/div[2]/div/div/button');
//   		await page.getByRole('combobox', { name: 'Manifest' }).click();
//   		await page.waitForTimeout(5000);
//   		await page.getByRole('combobox', { name: 'Manifest' }).press('Enter');
//   		const page2Promise = page.waitForEvent('popup');
//   		const download1Promise = page.waitForEvent('download');
//   		await page.locator('button[name="generate_csv"]').click();
//   		const page2 = await page2Promise;
//   		const download1 = await download1Promise;
// 	});

// 	test('QCP14347 + QCP07406 Verify the user can create and validate the "Sorting" internal transfer in barcode + Verify product can be put in pack', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
//         await page.getByRole('button', { name: 'Operations' }).click();
        
//         await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[6]/div/div[1]/span[2]');
//         await page.waitForTimeout(30000);
//         await page.getByRole('button', { name: 'New' }).click();

//         await page.waitForTimeout(30000);
// 		await expect.soft(page.locator('div[name="barcode_messages"]')).toBeVisible();
//         await page.keyboard.type(lpnArray[0]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[1]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[2]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[3]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[4]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[5]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
// 		await page.keyboard.type(lpnArray[6]);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(5000);
//         await page.click('xpath=/html/body/div[1]/div/footer/button[2]');
//         await page.waitForTimeout(20000);
// 		packageValue = await page.locator('span.result-package').first().textContent();
// 		packageValue = packageValue.trim();
//         await page.click('xpath=/html/body/div[1]/div/footer/button[3]');
//         await page.waitForTimeout(30000);
//         await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
// 	});

// 	test('QCP14348 Verify the product shall go to "Sorting" location on validating the "Sorting" operation in barcode ', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Lots/Serial Numbers' }).click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
// 		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
// 		await page.getByRole('cell', { name: lpnArray[0] }).click();
// 		await page.waitForSelector('input#amazon_status_code_0', { timeout: 10000 });
// 		await expect.soft(page.locator('input#location_id_0')).toHaveValue(/Sorting/);
// 	});

// 	test('Verify the Work Orders and Quality Checks are Created on Repair when confirmed ', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Repairs' }).click();
//   		await page.getByRole('button', { name: 'Remove' }).click();
//   		await page.getByRole('searchbox', { name: 'Search...' }).fill(lpnArray[0]);
//   		await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
//   		await page.getByRole('cell', { name: lpnArray[0] }).click();
//   		await expect.soft(page.locator('button[data-value="confirmed"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
// 		await expect(page.locator('button[name="action_open_quality_checks"]')).toBeVisible();
// 		await expect(page.locator('tr.o_data_row.o_row_draggable').first()).toBeVisible();
// 	});

// 	test('QCP14344 Verify the user can create "New" transfer for NV warehouse in Barcode', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
// 		await page.getByRole('button', { name: 'Operations' }).click();
// 		await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[5]/div/div[1]/span[2]');
		
// 		await page.getByRole('button', { name: 'New' }).click();
// 		await page.waitForTimeout(20000);
// 	});


// 	test('QCP14351 Verify the user can perform the "Move Pallet" operation', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
//         await page.getByRole('button', { name: 'Operations' }).click();
        
//         await page.click('xpath=/html/body/div[1]/div/div[2]/div/article[11]/div/div[1]');
//         await page.waitForTimeout(30000);
//         await page.getByRole('button', { name: 'New' }).click();
//         await page.waitForTimeout(30000);
// 		await expect.soft(page.locator('xpath=/html/body/div[1]/div/header/div[2]/div/span[2]')).toBeVisible();
// 		await page.waitForTimeout(10000);
//         await page.keyboard.type("NV-SORTING");
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
// 		await page.keyboard.type(packageValue);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
// 		await page.keyboard.type("PPI1-FL-ROW-10");
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
//         await page.click('button.o_validate_page.btn.btn-primary');
//         await page.waitForTimeout(30000);
//         await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
// 	});

// 	//////////////////////////////////////////////
// 	test('QCP14350 Verify the user can perform the "Move Pallet to Repair Line" operation in Barcode', async () => {
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByRole('option', { name: 'Barcode' }).click();
//         await page.getByRole('button', { name: 'Operations' }).click();
                
//         await page.getByText('NV: Move Pallet to Repair Line', { exact: true }).click();
//         await page.waitForTimeout(20000);
//         await page.getByRole('button', { name: 'New' }).click();
		
//         await page.waitForTimeout(30000);
// 		await expect.soft(page.locator('xpath=/html/body/div[1]/div/header/div[2]/div/span[2]')).toBeVisible();
//         await page.keyboard.type("PPI1-FL-ROW-10");
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
//         await page.keyboard.type(packageValue);
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
//         await page.keyboard.type("NV-LINE 1 A");
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(10000);
//         await page.click('button.o_validate_page.btn.btn-primary');
//         await page.waitForTimeout(30000);
//         await expect.soft(page.locator('button.o_stock_mobile_barcode')).toBeVisible();
// 	});


// 	test('Verify the user can search the LPN in Repair Shop', async () => {
// 		await page.goto(process.env.SERVER_LINK);
        
//         await page.getByText('Repair Shop', { exact: true }).click();
// 		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
// 		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
// 		await searchBox.click();
// 		await searchBox.fill(lpnArray[0]);
// 		await page.keyboard.press('Enter');
// 		await page.waitForTimeout(20000);
		

// 	});

// 	test('Verify the state of repair order is Under Repair when user starts the repair work order in Repair Shop', async () => {
//         await page.goto(process.env.SERVER_LINK);
//         await page.getByText('Repair Shop', { exact: true }).click();
// 		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.getByText('Repair Shop', { exact: true }).click();
// 		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
// 		const lpn = lpnArray[0];
// 		await searchBox.click();
// 		await searchBox.fill(lpn);
// 		await page.keyboard.press('Enter');
// 		const recordCard = page.locator('div.o_repair_display_record').filter({ hasText: lpn });
// 		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
// 		await recordCard.getByRole('button', { name: 'LEVEL 1' }).click();

// 		// Soft assert: user is in Level 1 work center (active LEVEL 1 button visible)
// 		await expect.soft(page.locator('button.btn-light.text-nowrap.active').filter({ hasText: 'LEVEL 1' })).toBeVisible();

// 		// Soft assert: Work Order tile for the searched LPN is visible
// 		await expect.soft(page.locator('div.o_repair_display_record').filter({ hasText: lpn })).toBeVisible();

// 		// Additional soft assertions for key fields inside the record card
// 		// LPN text visible
// 		await expect.soft(recordCard.locator('i.fa-barcode').locator('xpath=following-sibling::span')).toHaveText(lpn);
// 		// Date visible
// 		await expect.soft(recordCard.locator('i.fa-calendar').locator('xpath=following-sibling::time')).toBeVisible();
// 		// Category path visible
// 		await expect.soft(recordCard.locator('i.fa-bars').locator('xpath=following-sibling::span')).toBeVisible();
// 		// Unit Cost visible
// 		await expect.soft(recordCard.locator('i.fa-money').locator('xpath=following-sibling::b')).toBeVisible();
// 		// BER bar present
// 		await expect.soft(recordCard.locator('div.border-progress-bar')).toBeVisible();
// 		// Status select present
// 		await expect.soft(recordCard.locator('select.form-select.form-select-sm')).toBeVisible();
// 		// Click play icon to start the repair
// 		await recordCard.locator('div.card-header i.fa-play').click();
// 		await page.waitForTimeout(5000);
// 		await page.goto(process.env.SERVER_LINK);
// 		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').waitFor({ state: 'visible', timeout: 10000 });
// 		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').click();
// 		await page.getByRole('button', { name: 'Remove' }).click();
// 		const searchBox2 = page.getByRole('searchbox', { name: 'Search...' });
// 		await searchBox2.click();
// 		await searchBox2.fill(lpn);
// 		await page.keyboard.press('Enter');
// 		// Open the repair order by clicking the LPN cell, then assert status
// 		const lpnCell = page.locator('td.o_list_many2one[name="lot_id"]').filter({ hasText: lpn }).first();
// 		await lpnCell.waitFor({ state: 'visible', timeout: 10000 });
// 		await lpnCell.click();
// 		// Assert status is Under Repair in the status bar
// 		const statusBar = page.locator('div.o_statusbar_status');
// 		await expect.soft(statusBar.getByRole('radio', { name: 'Under Repair' })).toHaveAttribute('aria-checked', 'true');
//         await page.waitForTimeout(5000);
// 	});

	test('Verify that user can perform Quality Checks in Repair Shop with Is IOG YES', async () => {
        await page.goto(process.env.SERVER_LINK);
        await page.getByText('Repair Shop', { exact: true }).click();
		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
		await page.goto(process.env.SERVER_LINK);
		await page.getByText('Repair Shop', { exact: true }).click();
		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		const lpn = lpnArray[1];
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		const recordCard = page.locator('div.o_repair_display_record').filter({ hasText: lpn });
		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
		await recordCard.getByRole('button', { name: 'LEVEL 1' }).click();

		// Soft assert: user is in Level 1 work center (active LEVEL 1 button visible)
		await expect.soft(page.locator('button.btn-light.text-nowrap.active').filter({ hasText: 'LEVEL 1' })).toBeVisible();

		// Soft assert: Work Order tile for the searched LPN is visible
		await expect.soft(page.locator('div.o_repair_display_record').filter({ hasText: lpn })).toBeVisible();

		// Additional soft assertions for key fields inside the record card
		// LPN text visible
		await expect.soft(recordCard.locator('i.fa-barcode').locator('xpath=following-sibling::span')).toHaveText(lpn);
		// Date visible
		await expect.soft(recordCard.locator('i.fa-calendar').locator('xpath=following-sibling::time')).toBeVisible();
		// Category path visible
		await expect.soft(recordCard.locator('i.fa-bars').locator('xpath=following-sibling::span')).toBeVisible();
		// Unit Cost visible
		await expect.soft(recordCard.locator('i.fa-money').locator('xpath=following-sibling::b')).toBeVisible();
		// BER bar present
		await expect.soft(recordCard.locator('div.border-progress-bar')).toBeVisible();
		// Status select present
		await expect.soft(recordCard.locator('select.form-select.form-select-sm')).toBeVisible();
		// Click play icon to start the repair
		await recordCard.locator('div.card-header i.fa-play').click();
		
		// Handle Quality Check: Print LPN label → click Print Labels
		const printLabelHeading = page.getByRole('heading', { name: /Print LPN label/i });
		const printLabelAppeared = await printLabelHeading.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (printLabelAppeared) {
			const printLabelModal = page.locator('div.modal-content').filter({ has: printLabelHeading });
			await printLabelModal.getByRole('button', { name: /Print Labels/i }).click();
		}
		// Handle next Quality Check: Is it IOG? → click Yes
		const iogHeading = page.getByRole('heading', { name: /Is it IOG/i });
		const iogAppeared = await iogHeading.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (iogAppeared) {
			const iogModal = page.locator('div.modal-content').filter({ has: iogHeading });
			await iogModal.getByRole('button', { name: /Yes/i }).click();
		}
		// Handle third Quality Check: Send to Problem Solve → click Yes
		const psHeading = page.getByRole('heading', { name: /Send to Problem Solve/i });
		const psAppeared = await psHeading.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (psAppeared) {
			const psModal = page.locator('div.modal-content').filter({ has: psHeading });
			await psModal.getByRole('button', { name: /Yes/i }).click();
		}
		// Click Mark as Done on the active repair card
		const activeCard = page.locator('div.o_repair_display_record.o_active');
		await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
		await page.waitForTimeout(5000);

});





test('Verify the user can perform the PROBLEM SOLVER operation in repair shop, the Status of Repair Order shall be REPAIRED & status of work order shall be finished', async () => {
		await page.goto(process.env.SERVER_LINK);
		await page.getByText('Repair Shop', { exact: true }).click();
		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		const lpn = lpnArray[1];
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		const recordCard = page.locator('div.o_repair_display_record').filter({ hasText: lpn });
		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
		await recordCard.getByRole('button', { name: 'Problem Solve' }).click();
		await recordCard.locator('div.card-header i.fa-play').click();

		// Click Next in the Palletize QC modal
		const palletizeHeading = page.getByRole('heading', { name: /Palletize the item/i });
		const qcModal = page.locator('div.modal-content').filter({ has: palletizeHeading });
		await qcModal.waitFor({ state: 'visible', timeout: 10000 });
		await qcModal.getByRole('button', { name: 'Next' }).click();

		// Click Mark as Done on the active repair card
		const activeCard = page.locator('div.o_repair_display_record.o_active');
		await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
		await page.waitForTimeout(5000);
		await page.goto(process.env.SERVER_LINK);
		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').waitFor({ state: 'visible', timeout: 10000 });
		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').click();
		await page.getByRole('button', { name: 'Remove' }).click();
		const searchBox2 = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox2.click();
		await searchBox2.fill(lpn);
		await page.keyboard.press('Enter');
		// Open the repair order by clicking the LPN cell, then assert status
		const lpnCell = page.locator('td.o_list_many2one[name="lot_id"]').filter({ hasText: lpn }).first();
		await lpnCell.waitFor({ state: 'visible', timeout: 10000 });
		await lpnCell.click();
		// Assert status is Under Repair in the status bar
		const statusBar = page.locator('div.o_statusbar_status');
		await expect.soft(statusBar.getByRole('radio', { name: 'Repaired' })).toHaveAttribute('aria-checked', 'true');

		// Soft assert: Work Orders table statuses
		const workOrdersTable = page.locator('table.o_list_table').first();
		await workOrdersTable.waitFor({ state: 'visible', timeout: 10000 });
		const workOrderRows = workOrdersTable.locator('tbody tr.o_data_row');
		const rowCount = await workOrderRows.count();
		for (let i = 0; i < rowCount; i++) {
			const row = workOrderRows.nth(i);
			const nameCellText = (await row.locator('td[name="name"]').innerText()).trim();
			const stateBadge = row.locator('td[name="state"] .badge');
			if (/^(LEVEL\s*1|Problem\s*Solve)$/i.test(nameCellText)) {
				await expect.soft(stateBadge).toHaveText(/Finished/i);
			} else {
				await expect.soft(stateBadge).toHaveText(/Cancelled/i);
			}
		}
});


	/////////////////////////////////////////////


	test.afterAll(async () => {
    	await page.goto(process.env.SERVER_LINK);
    	await page.getByRole('button', { name: 'User' }).click();
    	await page.getByRole('menuitem', { name: /Log out/i }).click();
    	await page.close();
	});
});



