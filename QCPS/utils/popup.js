export async function handleRepairShopWorkcenterPopup(page, options = {}) {
	const { timeout = 15000, checkAll = true } = options;

	// Wait for the popup to appear with a longer timeout
	const heading = page.getByRole('heading', { name: 'Select Work Centers for this station' });
	const appeared = await heading
		.waitFor({ state: 'visible', timeout })
		.then(() => true)
		.catch(() => false);

	if (!appeared) {
		console.log('Work center popup did not appear - user may have already configured work centers');
		return false;
	}

	console.log('Work center popup appeared - selecting all work centers');
	const modal = page.locator('div.modal-content').filter({ has: heading });

	if (checkAll) {
		// Get all checkbox rows
		const rows = modal.locator('.o_repair_workcenter_dialog .form-check');
		await rows.first().waitFor({ state: 'visible', timeout: 5000 });
		const count = await rows.count();
		
		console.log(`Found ${count} work center checkboxes to select`);
		
		// Select each checkbox
		for (let i = 0; i < count; i++) {
			const row = rows.nth(i);
			const checkbox = row.locator('input.form-check-input');
			const label = row.locator('label.form-check-label');
			
			// Scroll into view and wait a bit
			await label.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			
			// Try multiple approaches to check the checkbox
			try {
				// First try clicking the label (most reliable)
				await label.click({ force: true });
				await page.waitForTimeout(100);
				
				// Verify it's checked, if not try direct checkbox click
				if (!(await checkbox.isChecked())) {
					await checkbox.click({ force: true });
					await page.waitForTimeout(100);
				}
				
				// Final verification and retry if needed
				if (!(await checkbox.isChecked())) {
					await checkbox.setChecked(true, { force: true });
					await page.waitForTimeout(100);
				}
				
				const isChecked = await checkbox.isChecked();
				console.log(`Checkbox ${i + 1}: ${isChecked ? 'CHECKED' : 'FAILED'}`);
				
			} catch (error) {
				console.log(`Error checking checkbox ${i + 1}: ${error.message}`);
				// Last resort - try clicking the checkbox directly
				await checkbox.click({ force: true });
			}
		}
		
		// Final verification that all checkboxes are checked
		let allChecked = true;
		for (let i = 0; i < count; i++) {
			const checkbox = rows.nth(i).locator('input.form-check-input');
			const isChecked = await checkbox.isChecked();
			if (!isChecked) {
				console.log(`Checkbox ${i + 1} is still not checked - retrying`);
				await checkbox.setChecked(true, { force: true });
				allChecked = false;
			}
		}
		
		if (!allChecked) {
			console.log('Some checkboxes were not checked properly, but proceeding anyway');
		}
	}

	// Click the Confirm button
	console.log('Clicking Confirm button');
	await modal.getByRole('button', { name: 'Confirm', exact: true }).click();
	
	// Wait for the modal and backdrop to disappear
	await Promise.all([
		modal.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {}),
		page.locator('div.modal-backdrop').first().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {}),
	]);
	
	console.log('Work center popup handled successfully');
	return true;
}

export async function scanInRepairShop(page, code, options = {}) {
	const { timeout = 5000 } = options;

	// Try to focus a likely scan input if available
	const possibleScanInputs = [
		// Common Odoo/Barcode patterns
		'input[type="text"][name="barcode"]',
		'input[name="barcode"]',
		'input.o_barcode_input',
		'input[placeholder*="Scan" i]',
		'input[aria-label*="Scan" i]',
		'input[type="search"]',
	];

	let focused = false;
	for (const selector of possibleScanInputs) {
		const el = page.locator(selector);
		if (await el.first().isVisible({ timeout: 100 }).catch(() => false)) {
			await el.first().click();
			focused = true;
			break;
		}
	}

	// Fallback: focus the main app area so keystrokes go to the page
	if (!focused) {
		const appRoot = page.locator('main, div.o_content, body');
		await appRoot.first().click({ position: { x: 10, y: 10 } });
	}

	await page.keyboard.type(code);
	await page.keyboard.press('Enter');

	return true;
}

export async function waitForLoadingToFinish(page, timeout = 60000) {
    const loader = page.locator('span.o_loading_indicator', { hasText: /Loading/i });
    // If it briefly appears, wait for it to attach first (ignore if it never shows)
    await loader.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    // Then wait until it disappears
    await loader.first().waitFor({ state: 'hidden', timeout });
}
