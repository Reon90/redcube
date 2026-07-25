import esbuild from 'esbuild';
import copy from 'esbuild-copy-files-plugin';
import path from 'path';

const nodeBuiltIns = {
  name: 'node-builtins',
  setup(build) {
    const filter = /^(fs|path|crypto)$/;

    build.onResolve({ filter }, args => ({
      path: args.path,
      namespace: 'node-builtins-ns',
    }));

    build.onLoad({ filter, namespace: 'node-builtins-ns' }, () => ({
      contents: 'export default {}',
      loader: 'js',
    }));
  },
};

const isWatch = process.argv.includes('--watch');
const isServe = process.argv.includes('--serve');

const __dirname = import.meta.dirname;

const sharedOptions = {
  bundle: true,
  sourcemap: true,
  chunkNames: 'libs/[name]',
  assetNames: 'assets/[name]',
  loader: {
    '.glsl': 'text',
    '.vert': 'text',
    '.frag': 'text',
    '.h': 'text',
    '.hdr': 'file',
    '.jpeg': 'dataurl',
    '.jpg': 'dataurl',
    '.png': 'dataurl',
    '.gif': 'dataurl',
  },
};

const copyPlugin = copy({
  source: ['./index.html', './libktx.wasm', './draco_decoder.wasm', './glslang.wasm', './twgsl.wasm', './src/images'],
  target: './dist',
});

// Browser targets are loaded as <script> tags (see index.html) and must share
// the same IIFE global so the same demo code can drive either backend.
const browserTargets = [
  {
    name: 'redcube',
    entryPoints: [path.join(__dirname, '/src/redcube.ts')],
    outfile: path.join(__dirname, '/dist/redcube.js'),
    format: 'iife',
    globalName: 'redcube',
    plugins: [nodeBuiltIns, copyPlugin],
  },
  {
    name: 'redcube.webgpu',
    entryPoints: [path.join(__dirname, '/src/redcube.webgpu.ts')],
    outfile: path.join(__dirname, '/dist/redcube.webgpu.js'),
    format: 'iife',
    globalName: 'redcube',
    plugins: [nodeBuiltIns],
  },
];

// Headless Node target: real fs/path/crypto (no browser stub), CJS output so
// `import redcube from './dist/redcube.node.cjs'` (see index.js) picks up
// `module.exports` as the default import per Node's CJS/ESM interop.
const nodeTarget = {
  name: 'redcube.node',
  entryPoints: [path.join(__dirname, '/src/redcube.node.ts')],
  outfile: path.join(__dirname, '/dist/redcube.node.cjs'),
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  plugins: [],
};

function esbuildOptionsFor(target) {
  const { name, ...options } = { ...sharedOptions, ...target };
  return options;
}

async function buildOnce(target) {
  await esbuild.build(esbuildOptionsFor(target));
}

async function build() {
  await buildOnce(nodeTarget);
  console.log(`Built ${nodeTarget.name} -> ${path.relative(__dirname, nodeTarget.outfile)}`);

  if (isServe) {
    const contexts = await Promise.all(browserTargets.map(target => esbuild.context(esbuildOptionsFor(target))));
    await Promise.all(contexts.map(ctx => ctx.watch()));
    const { host, port } = await contexts[0].serve({
      servedir: 'dist',
      port: 8080,
    });
    console.log(`Serving at http://${host}:${port}`);
  } else if (isWatch) {
    const contexts = await Promise.all(browserTargets.map(target => esbuild.context(esbuildOptionsFor(target))));
    await Promise.all(contexts.map(ctx => ctx.watch()));
    console.log('Watching for changes...');
  } else {
    for (const target of browserTargets) {
      await buildOnce(target);
      console.log(`Built ${target.name} -> ${path.relative(__dirname, target.outfile)}`);
    }
    console.log('Build finished.');
  }
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
