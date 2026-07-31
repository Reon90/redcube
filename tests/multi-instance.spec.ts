import { test, expect } from 'playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const APP_URL = process.env.APP_URL ?? 'http://localhost:8080';

// This is the completion signal for the Sprint 3 RenderContext migration:
// module-global `let gl` (and friends) used to be shared across every
// RedCube instance on a page, so a second instance's setGl() call would
// silently clobber the first instance's rendering state. Now that every
// class holds its own `this.gl`, two instances on one page should render
// independently, and mutating one must not affect the other.

function hasNonBlackPixel(pixels: Buffer) {
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
            return true;
        }
    }
    return false;
}

async function waitForCanvasNotBlack(page, canvasSelector: string, timeout = 60000, pollInterval = 300) {
    const start = Date.now();
    const canvas = page.locator(canvasSelector);

    while (Date.now() - start < timeout) {
        const buffer = await canvas.screenshot({ type: 'png' });
        const pixels = PNG.sync.read(buffer).data;
        if (hasNonBlackPixel(pixels)) {
            return;
        }
        await page.waitForTimeout(pollInterval);
    }
    throw new Error(`canvas ${canvasSelector} stayed black after ${timeout}ms`);
}

test('two RedCube instances on the same page render independently', async ({ page }) => {
    await page.goto(`${APP_URL}?model=Box&webgpu=0`);
    await page.evaluate(() => {
        (window as any).__FORCE_DETERMINISTIC__ = true;
    });

    await waitForCanvasNotBlack(page, '#canvas');
    await page.evaluate(() => {
        const selector = document.getElementById('selector');
        if (selector) selector.style.display = 'none';
    });

    // Second, independent instance pointed at a visually distinct model,
    // on a second canvas, entirely separate from the page's own instance.
    await page.evaluate(async () => {
        // Adding a second full-flow canvas grows the page past the viewport
        // and introduces a scrollbar that visually overlaps canvas #1's
        // screenshot region - unrelated to the actual thing under test.
        // Suppress it so canvas #1's captured pixels can't be disturbed by
        // page layout/chrome, only by actual rendering state.
        document.documentElement.style.overflow = 'hidden';

        const canvas2 = document.createElement('canvas');
        canvas2.id = 'canvas2';
        canvas2.style.width = '640px';
        canvas2.style.height = '480px';
        document.body.appendChild(canvas2);

        (window as any).renderer2 = new (window as any).redcube.RedCube(
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
            canvas2,
            [],
            'env.hdr',
            'pbr',
        );
        await new Promise<void>((resolve) => (window as any).renderer2.init(() => resolve()));
        (window as any).__FORCE_DETERMINISTIC__ = true;
    });

    await waitForCanvasNotBlack(page, '#canvas2');

    const [buffer1Before, buffer2] = await Promise.all([
        page.locator('#canvas').screenshot({ type: 'png' }),
        page.locator('#canvas2').screenshot({ type: 'png' }),
    ]);

    // Both instances produced real, and different, content - not both
    // blank, and not one clobbering the other into showing the same thing.
    expect(hasNonBlackPixel(PNG.sync.read(buffer1Before).data)).toBeTruthy();
    expect(hasNonBlackPixel(PNG.sync.read(buffer2).data)).toBeTruthy();
    expect(buffer1Before.equals(buffer2)).toBeFalsy();

    // Mutating the second instance (forcing a redraw/resize) must not
    // touch the first instance's rendering state or output - this is
    // exactly the cross-instance corruption the module-global `gl`
    // migration was meant to eliminate.
    await page.evaluate(() => {
        const renderer2 = (window as any).renderer2;
        renderer2.resize(true);
        const state2 = renderer2.getState();
        state2.renderer.reflow = true;
        state2.renderer.needUpdateView = true;
        state2.renderer.needUpdateProjection = true;
    });
    await page.waitForTimeout(500);

    const buffer1After = await page.locator('#canvas').screenshot({ type: 'png' });

    // Not a strict byte-equality check: even a fully static WebGL scene
    // isn't guaranteed pixel-identical between two separate captures (real
    // per-frame rendering variance, unrelated to cross-instance state) - so
    // compare with the same tolerance the main visual-regression suite uses.
    const before = PNG.sync.read(buffer1Before);
    const after = PNG.sync.read(buffer1After);
    expect(before.width).toBe(after.width);
    expect(before.height).toBe(after.height);
    const diff = new PNG({ width: before.width, height: before.height });
    const numDiffPixels = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0.1 });
    expect(numDiffPixels).toBeLessThanOrEqual(500);
});
