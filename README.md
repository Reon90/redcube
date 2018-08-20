# RedCube.js

A javascript library for rendering webgl. RedCube is a minimalistic viewer used [Khronos glTF 2.0 format](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0).

## Install
```
npm install redcube.js
```

## Features

&bull; Create 3D model in Blender and others, then render it in Browser;

&bull; No dependencies;

&bull; Support textures, transform animation, skinned animation, weight animation, PBR.

## How to convert 3D model to gltf

&bull; [COLLADA2GLTF](https://github.com/KhronosGroup/COLLADA2GLTF/) - Command-line tool to convert COLLADA to glTF

## Usage

[Demo](https://reon90.github.io/redcube/)

```js
const canvas = document.querySelector('canvas');
const renderer = new RedCube('./box.gltf', canvas);
renderer.init()
    .then(() => {
        console.log('loaded');
    });
```
