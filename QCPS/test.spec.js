import { test, expect } from '@playwright/test';

test('Verify the user can Generate and download the "Revenue Report History"', async ({ page }) => {
	// Step 1: Go to Server link
	await page.goto("https://prcstaging.silverdale.us/odoo");
	
	// Step 2: Login
	await page.getByRole('textbox', { name: 'Email' }).fill('pburlison@prcind.com');
	await page.getByRole('textbox', { name: 'Password' }).fill('Emission9-Schnapps-Barometer');
	await page.getByRole('button', { name: 'Log in' }).click();
	
	// Wait for login to complete and dashboard to load
	
	
	// Step 3: Go to "Repairs" app
	await page.getByRole('option', { name: 'Repairs' }).click();
	
	// Step 4: Click "Repair Report History" in the menu
	await page.getByRole('menuitem', { name: 'Revenue Report History' }).click();
	
	
	// Step 5: Click "New" button
	await page.getByRole('button', { name: 'New' }).click();
	
	
	// Step 6: Add Start Date: 10/01/2025 00:00:00
	await page.getByRole('textbox', { name: 'Start Date' }).fill('10/01/2025 00:00:00');
	
	// Step 7: Add End Date: 10/01/2025 23:00:00
	await page.getByRole('textbox', { name: 'End Date' }).fill('10/01/2025 23:00:00');
	
	// Step 8: Select Warehouse: PRC Industries, Inc. NC
	await page.getByRole('combobox', { name: 'Warehouse' }).click();
	await page.getByRole('option', { name: 'PRC Industries, Inc. NC' }).click();
	
	// Step 9: Save the record
	
	
	
	
	// Step 11: Verify the "Status" Shall be draft
	await expect(page.locator('select#state_0')).toHaveValue('"draft"');
	
	// Step 12: Click "Generate Report" button
	await page.getByRole('button', { name: 'Generate Report' }).click();
	
	// Step 13: Wait until the report is generated
	// Wait for the status to change from "Draft" to "Done"
	await page.waitForFunction(() => {
		const statusElement = document.querySelector('select#state_0');
		return statusElement && statusElement.value === '"done"';
	}, { timeout: 300000 }); // Wait up to 5 minutes for report generation
	// Wait for the status to change from "Draft" to "Done"
	
	// Step 14: Verify the report file shall be generated and attached in the "Report File" field
	await expect(page.locator('text=Revenue_Report_October_2025.xlsx')).toBeVisible();
	
	// Step 15: Verify Status shall be "Done"
	await expect(page.locator('select#state_0')).toHaveValue('"done"');
	
	// Step 16: Click the little download button which appears in the "Report File"
	const downloadLink = page.getByRole('link', { name: ' Revenue_Report_October_2025.xlsx' });
	await expect(downloadLink).toBeVisible();
	
	// Set up download promise before clicking
	const downloadPromise = page.waitForEvent('download');
	await downloadLink.click();
	
	// Wait for download to complete
	const download = await downloadPromise;
	
	// Verify download was successful
	expect(download.suggestedFilename()).toContain('.xlsx'); // Excel format
	console.log(`Downloaded file: ${download.suggestedFilename()}`);
});
