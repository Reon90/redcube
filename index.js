import 'source-map-support/register.js';
import redcube from './dist/redcube.node.cjs';

var x = new redcube.RedCube('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF/AntiqueCamera.gltf');
x.init(scene => {
  debugger
  console.log(scene)});
