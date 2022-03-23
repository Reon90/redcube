# RedCube.js

[WebGL Demo](https://reon90.github.io/redcube/) | [WebGPU Demo](https://reon90.github.io/redcube?webgpu=1)

A javascript library for rendering webgl. RedCube is a minimalistic viewer used [Khronos glTF 2.0 format](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0).

## Features

([Features checking page](https://github.com/cx20/gltf-test))

&bull; glTF Specification, 2.0

&bull; KHR_draco_mesh_compression

&bull; KHR_lights_punctual

&bull; KHR_materials_clearcoat

&bull; KHR_materials_pbrSpecularGlossiness

&bull; KHR_materials_sheen

&bull; KHR_materials_transmission

&bull; KHR_materials_volume

&bull; KHR_materials_emissive_strength

&bull; KHR_materials_iridescence

&bull; KHR_materials_unlit

&bull; KHR_materials_variants

&bull; KHR_mesh_quantization

&bull; KHR_texture_basisu

&bull; KHR_texture_transform

&bull; EXT_lights_image_based

## Platforms

&bull; Browsers with WebGL 2.0 support

&bull; Browsers with WebGPU support (Chrome Canary with `--enable-unsafe-webgpu` flag)

&bull; Node.js renderless

## How to convert 3D model to gltf

&bull; Blender 2.80 File -> Export -> glTF 2.0

&bull; [Sketchfab](https://sketchfab.com/models?features=downloadable&sort_by=-likeCount) 100,000+ models

## Usage

```js
<canvas style="width: 600px; height: 600px;"></canvas>

const renderer = new RedCube('./box.gltf', canvas);
renderer.init(() => {
    console.log('loaded');
});
```

## Install
```
npm install redcube.js
```
