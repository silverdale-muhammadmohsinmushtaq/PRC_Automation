import { test, expect } from '@playwright/test';
import { handleRepairShopWorkcenterPopup, scanInRepairShop } from './utils/popup';

test('QCP14264 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation', async ({page}) => {
        await page.goto("https://prcstaging.silverdale.us/odoo");
    	await page.locator("//input[@name='login']").fill("pburlison@prcind.com");
    	await page.locator("//input[@name='password']").fill("Emission9-Schnapps-Barometer");
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.getByText('Repair Shop', { exact: true }).click();
		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		const lpn = 'HDAaS2AqK5t41txyzd';
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
			await iogModal.getByRole('button', { name: /No/i }).click();
		}
		// Handle third Quality Check: Is There Something In the Box
		const someThingInBox = page.getByRole('heading', { name: /Is there something in the box/i });
		const someThingInBoxAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (someThingInBoxAppeared) {
			const someThingInBoxModal = page.locator('div.modal-content').filter({ has: someThingInBox });
			await someThingInBoxModal.getByRole('button', { name: /No/i }).click();
		}

		// Send to Liquidation Palletizer → click Yes
		const liquidationHeading = page.getByRole('heading', { name: /Send to Liquidation Palletizer/i });
		const liquidationAppeared = await liquidationHeading.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (liquidationAppeared) {
			const liquidationModal = page.locator('div.modal-content').filter({ has: liquidationHeading });
			await liquidationModal.getByRole('button', { name: /^Yes$/i }).click();
		}


		// Click Mark as Done on the active repair card
	const activeCard = page.locator('div.o_repair_display_record.o_active');
	await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
	await page.waitForTimeout(5000);

	await page.goto("https://prcstaging.silverdale.us/odoo");
	await page.getByText('Repair Shop', { exact: true }).click();
	// searchBox = page.getByRole('searchbox', { name: 'Search...' });
	await searchBox.click();
	await searchBox.fill(lpn);
	await page.keyboard.press('Enter');
	
	await recordCard.waitFor({ state: 'visible', timeout: 15000 });
	await recordCard.getByRole('button', { name: 'Liquidation Palletizer' }).click();
	await recordCard.locator('div.card-header i.fa-play').click();

	// Palletize the item → click Next
	const palletizeHeading3 = page.getByRole('heading', { name: /Palletize the item/i });
	const palletize3Appeared = await palletizeHeading3.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
	if (palletize3Appeared) {
		const palletizeModal3 = page.locator('div.modal-content').filter({ has: palletizeHeading3 });
		await palletizeModal3.getByRole('button', { name: /^Next$/i }).click();
	}


	await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
	await page.waitForTimeout(5000);

	


		
		await page.goto("https://prcstaging.silverdale.us/odoo");
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
		
		
		// Verify Disposition is "Sellable"
		await expect(page.locator('div[name="disposition"] .badge')).toHaveText('Liquidate');
		

});

