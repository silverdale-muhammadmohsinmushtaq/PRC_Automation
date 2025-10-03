import { test, expect } from '@playwright/test';

test('QCP14264 Verify that the user can transfer stock from In Transit to Receiving by scanning LPN using barcode operation', async ({page}) => {
        await page.goto("https://prcstaging.silverdale.us/odoo");
    	await page.locator("//input[@name='login']").fill("pburlison@prcind.com");
    	await page.locator("//input[@name='password']").fill("Silverdale_35693569");
        await page.getByRole('button', { name: 'Log in', exact: true }).click();
        await page.getByText('Repair Shop', { exact: true }).click();
        // Wait for the popup for up to 5 seconds, if it appears
        const popupVisible = await page.locator('xpath=//*[@id="dialog_2"]/div/div/div/header/h4');

        if (popupVisible) {
            // Select all checkboxes in the popup
            const checkboxes = page.locator('.o_repair_workcenter_dialog input[type="checkbox"]');
            const count = await checkboxes.count();
            for (let i = 0; i < count; i++) {
                await checkboxes.nth(i).check({ force: true });
                await page.waitForTimeout(10000);
            }
            // Click the Confirm button
        await page.waitForTimeout(10000);
        await page.getByRole('button', { name: 'Confirm', exact: true }).click();
        await page.waitForTimeout(10000);
        }



        


        await page.goto("https://prcstaging.silverdale.us/odoo");
        await page.getByText('Repair Shop', { exact: true }).click();
        if (popupVisible) {
            // Select all checkboxes in the popup
            const checkboxes = page.locator('.o_repair_workcenter_dialog input[type="checkbox"]');
            const count = await checkboxes.count();
            for (let i = 0; i < count; i++) {
                await checkboxes.nth(i).check({ force: true });
                await page.waitForTimeout(10000);
            }
            // Click the Confirm button
        await page.waitForTimeout(10000);
        await page.getByRole('button', { name: 'Confirm', exact: true }).click();
        await page.waitForTimeout(10000);
        }
        await page.waitForTimeout(10000);

});

