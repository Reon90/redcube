<h1 align="center">
  <br>
  <a href="https://github.com/Reon90/redcube"><img src="./img/cube.png" alt="redcube" width="200"></a>
  <br>
  RedCube
  <br>
  <br>
</h1>

<h3 align="center">The GLTF viewer with WebGL2 and WebGPU backends.</h3><br>

<p align="center">
  <a href="https://www.npmjs.com/package/redcube.js"><img src="https://img.shields.io/npm/v/redcube.js?color=%232e58ff&style=for-the-badge" alt="npm downloads"></a>
  <img src="https://img.shields.io/npm/types/typescript?color=%232e58ff&style=for-the-badge" alt="typescript">
  <img src="https://img.shields.io/github/last-commit/reon90/redcube?color=2e58ff&style=for-the-badge" alt="last commit">
  <img src="https://img.shields.io/bundlephobia/min/redcube.js?color=%232e58ff&style=for-the-badge" alt="size">
  <img src="https://img.shields.io/badge/code%20style-eslint-%232e58ff?style=for-the-badge" alt="eslint">
</p>

<div align="center">
  <h3>
    <a href="https://reon90.github.io/redcube">WebGL2 demo</a>
    <span> | </span>
    <a href="https://reon90.github.io/redcube?webgpu=1">WebGPU demo</a>
  </h3>
</div><br>

The javascript rendering library for [Khronos glTF 2.0 format](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0).

## Features

&bull; glTF Specification, 2.0

&bull; KHR_draco_mesh_compression

&bull; KHR_lights_punctual

&bull; KHR_materials_clearcoat
<p><img src="./img/clearcoat.webp" alt="KHR_materials_clearcoat"></p>

&bull; KHR_materials_pbrSpecularGlossiness

&bull; KHR_materials_sheen

&bull; KHR_materials_transmission

&bull; KHR_materials_volume
<p><img src="./img/volume.webp" alt="KHR_materials_volume"></p>

&bull; KHR_materials_emissive_strength

&bull; KHR_materials_iridescence
<p><img src="./img/iridescence.webp" alt="KHR_materials_iridescence"></p>

&bull; KHR_materials_unlit

&bull; KHR_materials_variants

&bull; KHR_mesh_quantization

&bull; KHR_texture_basisu

&bull; KHR_texture_transform

&bull; EXT_lights_image_based

&bull; KHR_materials_ior
<p><img src="./img/ior.webp" alt="KHR_materials_ior"></p>

[Check list](https://github.com/cx20/gltf-test)

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
