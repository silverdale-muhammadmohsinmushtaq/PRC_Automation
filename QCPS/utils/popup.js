export async function handleRepairShopWorkcenterPopup(page, options = {}) {
	const { timeout = 5000, checkAll = true } = options;

	const heading = page.getByRole('heading', { name: 'Select Work Centers for this station' });
	const appeared = await heading
		.waitFor({ state: 'visible', timeout })
		.then(() => true)
		.catch(() => false);

	if (!appeared) return false;

	const modal = page.locator('div.modal-content').filter({ has: heading });

	if (checkAll) {
		const checkboxes = modal.getByRole('checkbox');
		// Ensure checkboxes are rendered
		await checkboxes.first().waitFor({ state: 'visible', timeout });
		const count = await checkboxes.count();
		for (let i = 0; i < count; i++) {
			const checkbox = checkboxes.nth(i);
			await checkbox.scrollIntoViewIfNeeded();
			// Skip if already checked
			if (await checkbox.isChecked()) continue;
			// Try normal check first
			try {
				await checkbox.check();
			} catch (_) {
				// Fallbacks: force check or click the label next to input
				try {
					await checkbox.check({ force: true });
				} catch (_) {
					const label = checkbox.locator('xpath=following-sibling::label');
					await label.click({ force: true });
				}
			}
		}
		// Verify all are checked; if any remain, attempt once more using force
		for (let i = 0; i < count; i++) {
			const checkbox = checkboxes.nth(i);
			if (!(await checkbox.isChecked())) {
				await checkbox.check({ force: true });
			}
		}
	}

	await modal.getByRole('button', { name: 'Confirm', exact: true }).click();
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
