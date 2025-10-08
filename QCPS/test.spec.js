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
		const lpn = 'LPNPMEG7264770';
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
			await someThingInBoxModal.getByRole('button', { name: /Yes/i }).click();
		}

		// Open TREX
		const openTREX = page.getByRole('heading', { name: /Open T-Rex/i });
		const openTREXAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (openTREXAppeared) {
			const openTREXModal = page.locator('div.modal-content').filter({ has: openTREX });
			await openTREXModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Did T-Rex Open?
		const didTREXOpen = page.getByRole('heading', { name: /Did T-Rex Open/i });
		const didTREXOpenAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (didTREXOpenAppeared) {
			const didTREXOpenModal = page.locator('div.modal-content').filter({ has: didTREXOpen });
			await didTREXOpenModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Did T-Rex Open?
		const isItExpectedItem = page.getByRole('heading', { name: /Is it the expected item/i });
		const isItExpectedItemAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (isItExpectedItemAppeared) {
			const isItExpectedItemModal = page.locator('div.modal-content').filter({ has: isItExpectedItem });
			await isItExpectedItemModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Is the Item Factory Sealed?
		const isItemFactorySealed = page.getByRole('heading', { name: /Is the Item Factory Sealed/i });
		const isItemFactorySealedAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (isItemFactorySealedAppeared) {
			const isItemFactorySealedModal = page.locator('div.modal-content').filter({ has: isItemFactorySealed });
			await isItemFactorySealedModal.getByRole('button', { name: /No/i }).click();
		}

		// Does Item Need to be Destroyed?
		const doesItemNeedToBeDestroyed = page.getByRole('heading', { name: /Does the item need to be Destroyed/i });
		const doesItemNeedToBeDestroyedAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (doesItemNeedToBeDestroyedAppeared) {
			const doesItemNeedToBeDestroyedModal = page.locator('div.modal-content').filter({ has: doesItemNeedToBeDestroyed });
			await doesItemNeedToBeDestroyedModal.getByRole('button', { name: /No/i }).click();
		}


		// Does Item Have Scratches??
		const doesItemHaveScratches = page.getByRole('heading', { name: /Does the item have scratches or dents larger that a badge/i });
		const doesItemHaveScratchesAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (doesItemHaveScratchesAppeared) {
			const doesItemHaveScratchesModal = page.locator('div.modal-content').filter({ has: doesItemHaveScratches });
			await doesItemHaveScratchesModal.getByRole('button', { name: /No/i }).click();
		}


		// Did you do factory reset?
		const didYouDoFactoryReset = page.getByRole('heading', { name: /Did you do a Factory Reset/i });
		const didYouDoFactoryResetAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (didYouDoFactoryResetAppeared) {
			const didYouDoFactoryResetModal = page.locator('div.modal-content').filter({ has: didYouDoFactoryReset });
			await didYouDoFactoryResetModal.getByRole('button', { name: /No/i }).click();
		}


		// Does the itme work?
		const doesItemWork = page.getByRole('heading', { name: /Does the item work/i });
		const doesItemWorkAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (doesItemWorkAppeared) {
			const doesItemWorkModal = page.locator('div.modal-content').filter({ has: doesItemWork });
			await doesItemWorkModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Does it need parts?
		const doesItNeedParts = page.getByRole('heading', { name: /Does it need Parts/i });
		const doesItNeedPartsAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (doesItNeedPartsAppeared) {
			const doesItNeedPartsModal = page.locator('div.modal-content').filter({ has: doesItNeedParts });
			await doesItNeedPartsModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Does you have parts?
		const doesYouHaveParts = page.getByRole('heading', { name: /Do you have parts/i });
		const doesYouHavePartsAppeared = await someThingInBox.waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
		if (doesYouHavePartsAppeared) {
			const doesYouHavePartsModal = page.locator('div.modal-content').filter({ has: doesYouHaveParts });
			await doesYouHavePartsModal.getByRole('button', { name: /Yes/i }).click();
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

