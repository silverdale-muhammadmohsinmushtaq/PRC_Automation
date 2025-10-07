import { test, expect } from '@playwright/test';
import { handleRepairShopWorkcenterPopup, scanInRepairShop } from './utils/popup';

test('QCP14264 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation', async ({page}) => {
        await page.goto("https://prcstaging.silverdale.us/odoo");
    	await page.locator("//input[@name='login']").fill("pburlison@prcind.com");
    	await page.locator("//input[@name='password']").fill("Silverdale_35693569");
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.getByText('Repair Shop', { exact: true }).click();
		await handleRepairShopWorkcenterPopup(page, { timeout: 5000, checkAll: true });
		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		const lpn = 'HsAaS2AqK5t71txyzd';
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

		///////////////////////////////////////////CLEANING////////////////////////////////
		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		// searchBox = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		const recordCard2 = page.locator('div.o_repair_display_record').filter({ hasText: lpn });
		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
		await recordCard.getByRole('button', { name: 'Problem Solve' }).click();
		await recordCard.locator('div.card-header i.fa-play').click();

		// Click Next in the Palletize QC modal
		const palletizeHeading = page.getByRole('heading', { name: /Palletize the item/i });
		const qcModal = page.locator('div.modal-content').filter({ has: palletizeHeading });
		await qcModal.waitFor({ state: 'visible', timeout: 10000 });
		await qcModal.getByRole('button', { name: 'Next' }).click();

		// Click Mark as Done on the active repair card
		const activeCard2 = page.locator('div.o_repair_display_record.o_active');
		await activeCard2.getByRole('button', { name: 'Mark as Done' }).click();
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

