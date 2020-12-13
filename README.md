# RedCube.js

[Demo](https://reon90.github.io/redcube/)

A javascript library for rendering webgl. RedCube is a minimalistic viewer used [Khronos glTF 2.0 format](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0).

## Features

([Features checking page](https://github.com/cx20/gltf-test))

&bull; Fully support glTF main spec

&bull; Ratified Khronos Extensions

&bull; EXT_lights_image_based

&bull; KHR_mesh_quantization

&bull; KHR_materials_clearcoat

&bull; KHR_materials_transmission

## Platforms
Browser, Node.js

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
