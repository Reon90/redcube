import fs from 'fs-extra';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __dirname = import.meta.dirname;

export type CompareOptions = {
    baselineDir?: string; // default tests/baselines
    diffsDir?: string; // default tests/diffs
    threshold?: number; // pixelmatch threshold (0..1)
    failureThresholdPx?: number; // absolute number of pixels allowed
};

const DEFAULTS: Required<CompareOptions> = {
    baselineDir: path.resolve(__dirname, '..', 'baselines'),
    diffsDir: path.resolve(__dirname, '..', 'diffs'),
    threshold: 0.1,
    failureThresholdPx: 500,
};

export async function compareScreenshot(name: string, imageBuffer: Buffer, opts?: CompareOptions) {
    const options = { ...DEFAULTS, ...opts };
    await fs.ensureDir(options.baselineDir);
    await fs.ensureDir(options.diffsDir);

    const baselinePath = path.join(options.baselineDir, `${name}.png`);
    let diffPath = path.join(options.diffsDir, `${name}.diff.png`);

    if (!(await fs.pathExists(baselinePath)) || process.env.UPDATE_BASELINE === '1') {
        // create/update baseline
        await fs.writeFile(baselinePath, imageBuffer);
        return { matched: true, createdBaseline: true };
    }

    const baseline = PNG.sync.read(await fs.readFile(baselinePath));
    const actual = PNG.sync.read(imageBuffer);

    if (baseline.width !== actual.width || baseline.height !== actual.height) {
        // write diff showing mismatch sizes
        const diff = new PNG({ width: Math.max(baseline.width, actual.width), height: Math.max(baseline.height, actual.height) });
        // Fill with red background for clarity
        await fs.writeFile(diffPath, PNG.sync.write(diff));
        return { matched: false, reason: 'size-mismatch', baselinePath, diffPath };
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const numDiffPixels = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, {
        threshold: options.threshold,
    });

    const matched = numDiffPixels <= options.failureThresholdPx;
    if (!matched) {
        diffPath = path.join(options.diffsDir, `${name}.${numDiffPixels}.png`);
        await fs.writeFile(diffPath, PNG.sync.write(diff));
    }

    return { matched, numDiffPixels, baselinePath, diffPath };
}
