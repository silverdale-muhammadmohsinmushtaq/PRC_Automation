export async function handleRepairShopWorkcenterPopup(page, options = {}) {
	const { timeout = 10000, checkAll = true } = options;

	const heading = page.getByRole('heading', { name: 'Select Work Centers for this station' });
	const appeared = await heading
		.waitFor({ state: 'visible', timeout })
		.then(() => true)
		.catch(() => false);

	if (!appeared) return false;

	const modal = page.locator('div.modal-content').filter({ has: heading });

	if (checkAll) {
		// Workcenter rows provide stable handles to inputs and labels
		const rows = modal.locator('.o_repair_workcenter_dialog .form-check');
		await rows.first().waitFor({ state: 'visible', timeout });
		const count = await rows.count();
		for (let i = 0; i < count; i++) {
			const row = rows.nth(i);
			const cb = row.locator('input.form-check-input');
			const label = row.locator('label.form-check-label');
			await label.scrollIntoViewIfNeeded();
			try {
				await cb.setChecked(true, { force: true });
			} catch (_) {
				await label.click({ force: true });
			}
			if (!(await cb.isChecked())) {
				await cb.setChecked(true, { force: true });
			}
		}
		// Verify all are checked before closing
		for (let i = 0; i < count; i++) {
			const cb = rows.nth(i).locator('input.form-check-input');
			if (!(await cb.isChecked())) {
				throw new Error('Workcenter checkbox not checked');
			}
		}
	}

	await modal.getByRole('button', { name: 'Confirm', exact: true }).click();
	// Ensure the popup (and any backdrop) is fully gone before continuing
	await Promise.all([
		modal.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {}),
		page.locator('div.modal-backdrop').first().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {}),
	]);
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
