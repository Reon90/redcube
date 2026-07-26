import { test, expect } from 'playwright/test';
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

async function waitForRendererReady(page, timeout = 600000) {
    await page.waitForFunction(() => (window as any).__TEST_READY__ === true, null, { timeout });
}

test.describe('visual: renderer — all models', () => {
    for (const model of MODELS) {
        test(`model: ${model}`, async ({ page }) => {
            await page.goto(`${APP_URL}?model=${model}&webgpu=${MODE}`);

            await page.evaluate(() => {
                (window as any).__FORCE_DETERMINISTIC__ = true;
            });

            await waitForRendererReady(page);
            await page.waitForTimeout(50);

            const canvas = await page.locator('canvas').first();
            const buffer = await canvas.screenshot({ type: 'png' });

            const result = await compareScreenshot(`model-${model}`, buffer);
            expect(result.matched, `Visual diff: ${result.diffPath}`).toBeTruthy();
        });
    }
});
