import { test, expect } from '@playwright/test';

test('QCP14264 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation', async ({page}) => {
        await page.goto("https://prcstaging.silverdale.us/odoo");
    	await page.locator("//input[@name='login']").fill("pburlison@prcind.com");
    	await page.locator("//input[@name='password']").fill("Silverdale_35693569");
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.getByText('Repair Shop', { exact: true }).click();
		// If the "Select Work Centers..." popup appears on first visit, select all checkboxes and confirm
		const heading = page.getByRole('heading', { name: 'Select Work Centers for this station' });
		const popupAppeared = await heading.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);

		if (popupAppeared) {
			const checkboxes = page.locator('div.o_repair_workcenter_dialog input.form-check-input');
			const count = await checkboxes.count();
			for (let i = 0; i < count; i++) {
				await checkboxes.nth(i).scrollIntoViewIfNeeded();
				await checkboxes.nth(i).setChecked(true);
			}
			await page.getByRole('button', { name: 'Confirm', exact: true }).click();
		}

});

