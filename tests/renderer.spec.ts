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
    'LightsPunctualLamp',
    'MandarinOrange',
    'MaterialsVariantsShoe',
    'MeshPrimitiveModes',
    'MetalRoughSpheres',
    'MetalRoughSpheresNoTextures',
    'MorphPrimitivesTest',
    'MorphStressTest',
    'MosquitoInAmber',
    'MultiUVTest',
    'MultipleScenes',
    'NegativeScaleTest',
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

test.describe('visual: renderer — all models', () => {
    for (const model of MODELS) {
        test(`model: ${model}`, async ({ page }) => {
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

            await page.goto(`${APP_URL}?model=${model}&webgpu=${MODE}`);

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

            const result = await compareScreenshot(`model-${model}`, buffer);
            expect(result.reason, result.reason).toBeUndefined();
            expect(result.matched, `Visual diff: ${result.diffPath}`).toBeTruthy();
        });
    }
});
