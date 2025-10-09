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
		const lpn = 'LPNPMEM1676459';
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
		const didTREXOpen = page.getByRole('heading', { name: /Did T-?Rex Open/i });
		const didTREXOpenAppeared = await didTREXOpen.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (didTREXOpenAppeared) {
			const didTREXOpenModal = page.locator('div.modal-content').filter({ has: didTREXOpen });
			await didTREXOpenModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Is it expected Item?
		const isItExpectedItem = page.getByRole('heading', { name: /Is it the expected item\??/i });
		const isItExpectedItemAppeared = await isItExpectedItem.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (isItExpectedItemAppeared) {
			const isItExpectedItemModal = page.locator('div.modal-content').filter({ has: isItExpectedItem });
			await isItExpectedItemModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Is the Item Factory Sealed?
		const isItemFactorySealed = page.getByRole('heading', { name: /Is the Item Factory Sealed\??/i });
		const isItemFactorySealedAppeared = await isItemFactorySealed.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (isItemFactorySealedAppeared) {
			const isItemFactorySealedModal = page.locator('div.modal-content').filter({ has: isItemFactorySealed });
			await isItemFactorySealedModal.getByRole('button', { name: /^No$/i }).click();
		}

		// Does Item Need to be Destroyed?
		const doesItemNeedToBeDestroyed = page.getByRole('heading', { name: /Does the item need to be Destroyed\??/i });
		const doesItemNeedToBeDestroyedAppeared = await doesItemNeedToBeDestroyed.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (doesItemNeedToBeDestroyedAppeared) {
			const doesItemNeedToBeDestroyedModal = page.locator('div.modal-content').filter({ has: doesItemNeedToBeDestroyed });
			await doesItemNeedToBeDestroyedModal.getByRole('button', { name: /^No$/i }).click();
		}


		// Does Item Have Scratches?
		const doesItemHaveScratches = page.getByRole('heading', { name: /Does the item have scratches or dents larger that a badge\??/i });
		const doesItemHaveScratchesAppeared = await doesItemHaveScratches.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (doesItemHaveScratchesAppeared) {
			const doesItemHaveScratchesModal = page.locator('div.modal-content').filter({ has: doesItemHaveScratches });
			await doesItemHaveScratchesModal.getByRole('button', { name: /^No$/i }).click();
		}


		// Did you do factory reset?
		const didYouDoFactoryReset = page.getByRole('heading', { name: /Did you do a Factory Reset\??/i });
		const didYouDoFactoryResetAppeared = await didYouDoFactoryReset.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (didYouDoFactoryResetAppeared) {
			const didYouDoFactoryResetModal = page.locator('div.modal-content').filter({ has: didYouDoFactoryReset });
			await didYouDoFactoryResetModal.getByRole('button', { name: /^No$/i }).click();
		}


		// Does the item work?
		const doesItemWork = page.getByRole('heading', { name: /Does the item work\??/i });
		const doesItemWorkAppeared = await doesItemWork.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (doesItemWorkAppeared) {
			const doesItemWorkModal = page.locator('div.modal-content').filter({ has: doesItemWork });
			await doesItemWorkModal.getByRole('button', { name: /Yes/i }).click();
		}


		// Does it need parts?
		const doesItNeedParts = page.getByRole('heading', { name: /Does it need Parts\??/i });
		const doesItNeedPartsAppeared = await doesItNeedParts.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (doesItNeedPartsAppeared) {
			const doesItNeedPartsModal = page.locator('div.modal-content').filter({ has: doesItNeedParts });
			await doesItNeedPartsModal.getByRole('button', { name: /^Yes$/i }).click();
		}


		// Do you have parts?
		const doesYouHaveParts = page.getByRole('heading', { name: /Do you have parts\??/i });
		const doesYouHavePartsAppeared = await doesYouHaveParts.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (doesYouHavePartsAppeared) {
			const doesYouHavePartsModal = page.locator('div.modal-content').filter({ has: doesYouHaveParts });
			await doesYouHavePartsModal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// Track products added from catalog
		const addedProducts = [];

		// Click Add Parts in the next QC modal
		const addPartsHeading = page.getByRole('heading', { name: /Add the Parts/i });
		const addPartsModal = page.locator('div.modal-content').filter({ has: addPartsHeading });
		const addPartsAppeared = await addPartsModal.waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
		if (addPartsAppeared) {
			const addPartsButton = addPartsModal.locator('button[name="addComponent"]').first();
			await addPartsButton.waitFor({ state: 'visible', timeout: 30000 });
			await addPartsButton.click();

			// Select a few products dynamically from the Products catalog
			const productsHeading = page.getByRole('heading', { name: /Products/i });
			const productsModal = page.locator('div.modal-content').filter({ has: productsHeading });
			await productsModal.waitFor({ state: 'visible', timeout: 30000 });
			const productCards = productsModal.locator('article.o_kanban_record');
			const cardsCount = await productCards.count();
			const maxToAdd = Math.min(cardsCount, 3);
			for (let i = 0; i < maxToAdd; i++) {
				const card = productCards.nth(i);
				const title = (await card.locator('span.fw-bolder.fs-4.text-reset.mb-1').first().innerText()).trim();
				addedProducts.push(title);
				await card.getByRole('button', { name: /Add/i }).click();
			}
			// Close the Products modal (click the X button)
			await productsModal.locator('button.btn-close[aria-label="Close"]').click();
			await addPartsButton.waitFor({ state: 'visible', timeout: 30000 });
			await addPartsButton.click();
			await productsModal.locator('button.btn-close[aria-label="Close"]').click();
		}

		// Confirm Add Parts (Yes button appears only after parts are added)
		const addPartsHeading2 = page.getByRole('heading', { name: /Add the Parts/i });
		const addPartsModal2 = page.locator('div.modal-content').filter({ has: addPartsHeading2 });
		const addPartsConfirmAppeared = await addPartsModal2.waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
		if (addPartsConfirmAppeared) {
			const yesButton = addPartsModal2.getByRole('button', { name: /^Yes$/i });
			await yesButton.waitFor({ state: 'visible', timeout: 40000 });
			await yesButton.click();
		}




		// Did you use Harvested Parts?
		const harvestedPartsHeading = page.getByRole('heading', { name: /Did you use Harvested Parts\??/i });
		const harvestedPartsAppeared = await harvestedPartsHeading.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (harvestedPartsAppeared) {
			const harvestedPartsModal = page.locator('div.modal-content').filter({ has: harvestedPartsHeading });
			await harvestedPartsModal.getByRole('button', { name: /^No$/i }).click();
		}

		// Does it need Sanitization?
		const sanitizeHeading = page.getByRole('heading', { name: /Does it need Sanitization\??/i });
		const sanitizeAppeared = await sanitizeHeading.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (sanitizeAppeared) {
			const sanitizeModal = page.locator('div.modal-content').filter({ has: sanitizeHeading });
			await sanitizeModal.getByRole('button', { name: /^No$/i }).click();
		}

		// Complete T-Rex Sellable → click Yes
		const completeTrexHeading = page.getByRole('heading', { name: /Complete T-?Rex Sellable/i });
		const completeTrexAppeared = await completeTrexHeading.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
		if (completeTrexAppeared) {
			const completeTrexModal = page.locator('div.modal-content').filter({ has: completeTrexHeading });
			await completeTrexModal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// Verify parts added to the active repair tile dynamically
		const activeTile = page.locator('div.o_repair_display_record.o_active');
		await activeTile.waitFor({ state: 'visible', timeout: 10000 });
		for (const productName of addedProducts) {
			const line = activeTile.locator('li.o_repair_display.list-group-item').filter({
				has: page.locator('span[data-tooltip="Product"]').filter({ hasText: productName })
			}).first();
			await expect.soft(line).toBeVisible();
			// Assert Done equals Demand (e.g., 1 / 1)
			const doneText = (await line.locator('span[data-tooltip="Done"]').innerText()).trim();
			const demandText = (await line.locator('span[data-tooltip="Demand"]').innerText()).trim();
			const doneNum = parseInt(doneText, 10);
			const demandNum = parseInt(demandText, 10);
			expect.soft(doneNum).toBe(demandNum);
		}

		


		


		// Click Mark as Done on the active repair card
		const activeCard = page.locator('div.o_repair_display_record.o_active');
		await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
		await page.waitForTimeout(5000);



		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').waitFor({ state: 'visible', timeout: 10000 });
		await page.locator('a.o_app[data-menu-xmlid="repair.menu_repair_order"]').click();
		await page.getByRole('button', { name: 'Remove' }).click();
		//const searchBox = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		// Open the repair order by clicking the LPN cell, then assert status
		const lpnCell = page.locator('td.o_list_many2one[name="lot_id"]').filter({ hasText: lpn }).first();
		await lpnCell.waitFor({ state: 'visible', timeout: 10000 });
		await lpnCell.click();

		// Switch to Parts tab
		await page.getByRole('tab', { name: 'Parts' }).click();

		// Verify Parts tab contains all products added earlier
		const partsTable = page.locator('table.o_list_table').first();
		await partsTable.waitFor({ state: 'visible', timeout: 30000 });
		const partRows = partsTable.locator('tbody tr.o_data_row');
		for (const productName of addedProducts) {
			const row = partRows.filter({ has: page.locator('td[name="product_id"]').filter({ hasText: productName }) }).first();
			await expect.soft(row).toBeVisible();
			// Assert Done equals Demand for the part line
			const demand = parseFloat((await row.locator('td[name="product_uom_qty"]').innerText()).trim());
			const done = parseFloat((await row.locator('td[name="quantity"]').innerText()).trim());
			expect.soft(done).toBe(demand);
		}
		






		///////////////////////////////////////////CLEANING////////////////////////////////
		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		// searchBox = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		
		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
		await recordCard.getByRole('button', { name: 'Cleaner' }).click();
		await recordCard.locator('div.card-header i.fa-play').click();

		// DONE QC modal → click Yes
		const doneHeading2 = page.getByRole('heading', { name: /^DONE$/i });
		const done2Appeared = await doneHeading2.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (done2Appeared) {
			const done2Modal = page.locator('div.modal-content').filter({ has: doneHeading2 });
			await done2Modal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// Click Mark as Done on the active repair card
		await activeCard.getByRole('button', { name: 'Mark as Done' }).click();
		await page.waitForTimeout(5000);



		await page.goto("https://prcstaging.silverdale.us/odoo");
		await page.getByText('Repair Shop', { exact: true }).click();
		// searchBox = page.getByRole('searchbox', { name: 'Search...' });
		await searchBox.click();
		await searchBox.fill(lpn);
		await page.keyboard.press('Enter');
		await recordCard.waitFor({ state: 'visible', timeout: 15000 });
		await recordCard.getByRole('button', { name: 'Sellable Palletizer' }).click();
		await recordCard.locator('div.card-header i.fa-play').click();

		// Is the item factory Sealed? → click Yes
		const factorySealed2 = page.getByRole('heading', { name: /Is the item factory Sealed\??/i });
		const factorySealed2Appeared = await factorySealed2.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (factorySealed2Appeared) {
			const factorySealed2Modal = page.locator('div.modal-content').filter({ has: factorySealed2 });
			await factorySealed2Modal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// If "Are you using the Original Box?" appears, close it
		

		// Palletize the item QC → click Yes
		const palletizeHeading2 = page.getByRole('heading', { name: /Palletize the item/i });
		const palletizeAppeared = await palletizeHeading2.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (palletizeAppeared) {
  			const palletizeModal = page.locator('div.modal-content').filter({ has: palletizeHeading2 });
  			await palletizeModal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// If "Are you using the Original Box?" appears, close it (robust retry)
		const originalBoxHeading2 = page.getByRole('heading', { name: /Are you using the Original Box\s*\?/i });
		const originalBoxModal2 = page.locator('div.modal-content').filter({ has: originalBoxHeading2 });
		const originalBox2Appeared = await originalBoxModal2.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (originalBox2Appeared) {
              await originalBoxModal2.locator('button.btn-close[aria-label="Close"]').click();
              // optional: nudge the card state if needed
              await recordCard.locator('div.card-header i.fa-pause').click().catch(() => {});
              await recordCard.locator('div.card-header i.fa-play').click().catch(() => {});
              }

		// Did you add a Manual? → click Yes
		const manualHeading = page.getByRole('heading', { name: /Did you add a Manual\??/i });
		const manualAppeared = await manualHeading.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
		if (manualAppeared) {
			const manualModal = page.locator('div.modal-content').filter({ has: manualHeading });
			await manualModal.getByRole('button', { name: /^Yes$/i }).click();
		}

		// Click Mark as Done on the active repair card
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
		//const lpnCell = page.locator('td.o_list_many2one[name="lot_id"]').filter({ hasText: lpn }).first();
		await lpnCell.waitFor({ state: 'visible', timeout: 10000 });
		await lpnCell.click();
		
		
		// Verify Disposition is "Sellable"
		await expect(page.locator('div[name="disposition"] .badge')).toHaveText('Sellable');
		

});

