import { test, expect } from '@playwright/test';

test('QCP14264 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation', async ({page}) => {
        await page.goto("https://prcstaging.silverdale.us/odoo");
    	await page.locator("//input[@name='login']").fill("pburlison@prcind.com");
    	await page.locator("//input[@name='password']").fill("Silverdale_35693569");
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.goto("https://prcstaging.silverdale.us/odoo/crons?debug=1");
                await page.getByRole('searchbox', { name: 'Search...' }).click();
                await page.getByRole('searchbox', { name: 'Search...' }).fill('Automatically Confirm Repair Orders');
                await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
                await page.getByRole('cell', { name: 'Automatically Confirm Repair' }).click();
                await page.getByRole('button', { name: 'Run Manually' }).click();
                await page.goto('https://prcstaging.silverdale.us/web');
                await page.getByRole('option', { name: 'Repairs' }).click();
                await page.getByRole('button', { name: 'Remove' }).click();
                await page.getByRole('searchbox', { name: 'Search...' }).fill("MOHSINHELLO11xyz");
                await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
                await page.getByRole('cell', { name: "MOHSINHELLO11xyz" }).click();
                await expect.soft(page.locator('button[data-value="confirmed"][aria-current="step"]')).toHaveAttribute('aria-checked', 'true');
            });



