import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    // CI runners are resource-constrained enough that the renderer tab can
    // crash or lose its WebGL context outright (not just be slow) - retry
    // with a fresh page/context rather than treating that as a real failure.
    retries: process.env.CI ? 2 : 0,
    // Required for --shard to actually split work: without this, Playwright
    // keeps each file's tests together on one shard, and since all models
    // live in one spec file, every shard but one gets zero tests. workers is
    // capped rather than left to auto-detect CPU count, since running many
    // WebGL renders concurrently on one machine/runner risks GPU contention.
    fullyParallel: true,
    workers: 2,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        // Important to set deviceScaleFactor for DPR determinism
        // We'll vary this for multi-DPR tests if needed.
        // Playwright passes deviceScaleFactor to the browser context.
        deviceScaleFactor: 1,
        // slowdown? avoid unless debugging.
        launchOptions: {
            args: process.env.SWIFTSHADER ? ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader'] : [],
        },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] /* override flags below */ },
        },
    ],
});
