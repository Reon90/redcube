import { test, expect } from 'playwright/test';
import { PNG } from 'pngjs';
import { compareScreenshot } from './helpers/screenshotComparator';

const APP_URL = process.env.APP_URL ?? 'http://localhost:8080';
if (process.env.MODE === undefined) {
    throw new Error('no render mode');
}
const MODE = process.env.MODE === 'webgpu' ? 1 : 0;

const MODELS = [
    'ABeautifulGame',
    'AlphaBlendModeTest',
    'AnimatedColorsCube',
    'AnimatedCube',
    'AnimatedMorphCube',
    'AnimatedTriangle',
    'AnimationPointerUVs',
    'AnisotropyBarnLamp',
    'AnisotropyDiscTest',
    'AnisotropyRotationTest',
    'AnisotropyStrengthTest',
    'AntiqueCamera',
    'AttenuationTest',
    'Avocado',
    'BarramundiFish',
    'BoomBox',
    'BoomBoxWithAxes',
    'Box',
    'Box With Spaces',
    'BoxAnimated',
    'BoxInterleaved',
    'BoxTextured',
    'BoxTexturedNonPowerOfTwo',
    'BoxVertexColors',
    'BrainStem',
    'Cameras',
    'CarConcept',
    'CarbonFibre',
    'CesiumMan',
    'CesiumMilkTruck',
    'ChairDamaskPurplegold',
    'ChronographWatch',
    'ClearCoatCarPaint',
    'ClearCoatTest',
    'ClearcoatWicker',
    'CommercialRefrigerator',
    'CompareAlphaCoverage',
    'CompareAmbientOcclusion',
    'CompareAnisotropy',
    'CompareBaseColor',
    'CompareClearcoat',
    'CompareDispersion',
    'CompareEmissiveStrength',
    'CompareIor',
    'CompareIridescence',
    'CompareMetallic',
    'CompareNormal',
    'CompareRoughness',
    'CompareSheen',
    'CompareSpecular',
    'CompareTransmission',
    'CompareVolume',
    'Corset',
    'Cube',
    'CubeVisibility',
    'DamagedHelmet',
    'DiffuseTransmissionPlant',
    'DiffuseTransmissionTeacup',
    'DiffuseTransmissionTest',
    'DirectionalLight',
    'DispersionTest',
    'DragonAttenuation',
    'DragonDispersion',
    'Duck',
    'EmissiveStrengthTest',
    'EnvironmentTest',
    'FlightHelmet',
    'Fox',
    'GlamVelvetSofa',
    'GlassBrokenWindow',
    'GlassHurricaneCandleHolder',
    'GlassVaseFlowers',
    'IORTestGrid',
    'InterpolationTest',
    'IridescenceAbalone',
    'IridescenceDielectricSpheres',
    'IridescenceLamp',
    'IridescenceMetallicSpheres',
    'IridescenceSuzanne',
    'IridescentDishWithOlives',
    'Lantern',
    'LightVisibility',
    'LightsPunctualLamp',
    'MandarinOrange',
    'MaterialsVariantsShoe',
    'MeshPrimitiveModes',
    'MeshoptCubeTest',
    'MetalRoughSpheres',
    'MetalRoughSpheresNoTextures',
    'MorphPrimitivesTest',
    'MorphStressTest',
    'MosquitoInAmber',
    'MultiUVTest',
    'MultipleScenes',
    'NegativeScaleTest',
    'NodePerformanceTest',
    'NodeVisibilityTest',
    'NormalTangentMirrorTest',
    'NormalTangentTest',
    'OrientationTest',
    'PlaysetLightTest',
    'PointLightIntensityTest',
    'PotOfCoals',
    'PotOfCoalsAnimationPointer',
    'PrimitiveModeNormalsTest',
    'RecursiveSkeletons',
    'RiggedFigure',
    'RiggedSimple',
    'ScatteringSkull',
    'SciFiHelmet',
    'SheenChair',
    'SheenCloth',
    'SheenTestGrid',
    'SheenWoodLeatherSofa',
    'SimpleInstancing',
    'SimpleMaterial',
    'SimpleMeshes',
    'SimpleMorph',
    'SimpleSkin',
    'SimpleSparseAccessor',
    'SimpleTexture',
    'SpecGlossVsMetalRough',
    'SpecularSilkPouf',
    'SpecularTest',
    'Sponza',
    'StainedGlassLamp',
    'SunglassesKhronos',
    'Suzanne',
    'TextureCoordinateTest',
    'TextureEncodingTest',
    'TextureLinearInterpolationTest',
    'TextureSettingsTest',
    'TextureTransformMultiTest',
    'TextureTransformTest',
    'ToyCar',
    'TransmissionOrderTest',
    'TransmissionRoughnessTest',
    'TransmissionTest',
    'TransmissionThinwallTestGrid',
    'Triangle',
    'TriangleWithoutIndices',
    'TwoSidedPlane',
    'USDShaderBallForGltf',
    'Unicode❤♻Test',
    'UnlitTest',
    'VertexColorTest',
    'VirtualCity',
    'WaterBottle',
    'XmpMetadataRoundedCube',
];

async function waitForRendererReady(page, timeout = 60000, fastFail = () => null) {
    await waitForTestReady(page, timeout, fastFail);
    await waitForCanvasStable(page, timeout, 300, fastFail);
}

async function waitForTestReady(page, timeout = 60000, fastFail = () => null, pollInterval = 300) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const failure = fastFail();
        if (failure) {
            throw new Error(failure);
        }

        const ready = await page.evaluate(() => (window as any).__TEST_READY__ === true);
        if (ready) {
            return;
        }
        await page.waitForTimeout(pollInterval);
    }
}

function hasNonBlackPixel(pixels: Buffer) {
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
            return true;
        }
    }
    return false;
}

async function waitForCanvasStable(page, timeout = 60000, pollInterval = 300, fastFail = () => null) {
    const start = Date.now();
    const canvas = page.locator('canvas').first();

    let lastPixels: Buffer | null = null;

    while (Date.now() - start < timeout) {
        const failure = fastFail();
        if (failure) {
            throw new Error(failure);
        }

        const contextLost = await page.evaluate(() => (window as any).__WEBGL_CONTEXT_LOST__);
        if (contextLost) {
            throw new Error('WebGL context lost during render');
        }

        const buffer = await canvas.screenshot({ type: 'png' });
        const pixels = PNG.sync.read(buffer).data;

        if (lastPixels !== null && pixels.equals(lastPixels) && hasNonBlackPixel(pixels)) {
            return;
        }
        lastPixels = pixels;
        await page.waitForTimeout(pollInterval);
    }
}

async function runVisualTest(page, url: string, baselineName: string) {
    let crashed: string | null = null;
    page.on('crash', () => {
        crashed = 'page crashed';
    });

    let networkError: string | null = null;
    page.on('requestfailed', (request) => {
        if (request.url().includes('raw.githubusercontent.com')) {
            networkError = `request failed: ${request.url()} (${request.failure()?.errorText})`;
        }
    });
    page.on('response', (response) => {
        if (!response.ok() && response.url().includes('raw.githubusercontent.com')) {
            networkError = `request failed: ${response.url()} (HTTP ${response.status()})`;
        }
    });

    await page.addInitScript(() => {
        (window as any).__WEBGL_CONTEXT_LOST__ = false;
        document.addEventListener(
            'webglcontextlost',
            () => {
                (window as any).__WEBGL_CONTEXT_LOST__ = true;
            },
            true,
        );
    });

    await page.goto(url);

    await page.evaluate(() => {
        (window as any).__FORCE_DETERMINISTIC__ = true;
    });

    await waitForRendererReady(page, undefined, () => networkError ?? crashed);

    if (crashed) {
        throw new Error(crashed);
    }
    if (networkError) {
        throw new Error(networkError);
    }
    const contextLost = await page.evaluate(() => (window as any).__WEBGL_CONTEXT_LOST__);
    if (contextLost) {
        throw new Error('WebGL context lost during render');
    }

    await page.waitForTimeout(50);

    await page.evaluate(() => {
        const selector = document.getElementById('selector');
        if (selector) {
            selector.style.display = 'none';
        }
    });

    const canvas = await page.locator('canvas').first();
    const buffer = await canvas.screenshot({ type: 'png' });

    const result = await compareScreenshot(baselineName, buffer);
    expect(result.reason, result.reason).toBeUndefined();
    expect(result.matched, `Visual diff: ${result.diffPath}`).toBeTruthy();
}

test.describe('visual: renderer — all models', () => {
    for (const model of MODELS) {
        test(`model: ${model}`, async ({ page }) => {
            await runVisualTest(page, `${APP_URL}?model=${model}&webgpu=${MODE}`, `model-${model}`);
        });
    }
});

// index.html's loader only ever picks the glTF-Binary (falling back to
// plain glTF) variant for a model - Draco/Embedded/Quantized/KTX-BasisU
// never get exercised by the suite above even though redcube advertises
// support for all of them. index.html already supports overriding the
// variant via localStorage (used by its own variant <select>), so drive
// that from here instead of adding new app code.
const VARIANTS: Array<{ model: string; variantKey: string; file: string }> = [
    { model: 'Box', variantKey: 'glTF-Draco', file: 'Box.gltf' },
    { model: 'Box', variantKey: 'glTF-Embedded', file: 'Box.gltf' },
    { model: 'Duck', variantKey: 'glTF-Quantized', file: 'Duck.gltf' },
    { model: 'AnisotropyBarnLamp', variantKey: 'glTF-KTX-BasisU', file: 'AnisotropyBarnLamp.gltf' },
    // Not included: BrainStem/glTF-Meshopt-EXT. Unlike MeshoptCubeTest's
    // KHR_meshopt_compression variant (whose fallback buffer has a real,
    // fetchable URI), this file's fallback buffer has no uri at all - its
    // bytes only exist via meshopt decompression, which redcube doesn't
    // implement. That's a genuine, current gltf-spec gap (no
    // EXT_meshopt_compression support), not a test-coverage gap - confirmed
    // by the crash: arrayBuffer[1] resolves to undefined since there's
    // nothing to fetch, and geometry construction throws reading its
    // byteLength.
];

test.describe('visual: renderer — glTF format variants', () => {
    for (const { model, variantKey, file } of VARIANTS) {
        test(`variant: ${model} (${variantKey})`, async ({ page }) => {
            await page.addInitScript((variant) => {
                localStorage.setItem('variant', variant);
            }, `${variantKey}/${file}`);
            await runVisualTest(page, `${APP_URL}?model=${model}&webgpu=${MODE}`, `variant-${model}-${variantKey}`);
        });
    }
});
