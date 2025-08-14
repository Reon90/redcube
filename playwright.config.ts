import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        // Important to set deviceScaleFactor for DPR determinism
        // We'll vary this for multi-DPR tests if needed.
        // Playwright passes deviceScaleFactor to the browser context.
        deviceScaleFactor: 1,
        // slowdown? avoid unless debugging.
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] /* override flags below */ },
        },
    ],
});
