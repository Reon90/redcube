// Headless (no canvas/GPU) usage: parses a glTF file and gives you back a
// Scene graph - useful for validation, asset pipelines, or inspecting a
// model's structure without rendering it.
//
// Run from the repo root after `npm run build`:
//   node examples/node/load-model.js

import redcube from '../../dist/redcube.node.cjs';

const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF/AntiqueCamera.gltf';
const model = new redcube.RedCube(url);

try {
    await model.init((scene) => {
        console.log(`Loaded ${url}`);
        console.log(`  meshes: ${scene.meshes.length}`);
        console.log(`  cameras: ${scene.cameras?.length ?? 0}`);
        console.log(`  animations: ${scene.tracks?.length ?? 0}`);
    });
} catch (err) {
    console.error('Failed to load model:', err.message);
    process.exitCode = 1;
}
