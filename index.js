require('source-map-support').install();
const redcube = require('./dist/redcube.node');

var x = new redcube.RedCube('./models/Cube.gltf');
x.init(scene => {
  debugger
  console.log(scene)});
