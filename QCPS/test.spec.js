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
		const lpn = 'afs2MOHSIN51txyza';
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

