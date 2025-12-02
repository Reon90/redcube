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

const libraryName = 'redcube';
const isWatch = process.argv.includes('--watch');
const isServe = process.argv.includes('--serve');

const __dirname = import.meta.dirname;

const esbuildOptions = {
  entryPoints: [path.join(__dirname, `/src/${libraryName}.ts`)],
  bundle: true,
  outfile: path.join(__dirname, `/dist/${libraryName}.js`),
  format: 'iife',
  globalName: 'redcube',
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
  plugins: [
    nodeBuiltIns,
    copy({
      source: ['./index.html', './libktx.wasm', './draco_decoder.wasm', './glslang.wasm', './twgsl.wasm', './src/images'],
      target: './dist',
    }),
  ],
};

async function build() {
  if (isServe) {
    const ctx = await esbuild.context(esbuildOptions);
    await ctx.watch();
    const { host, port } = await ctx.serve({ 
      servedir: 'dist',
      port: 8080,
    });
    console.log(`Serving at http://${host}:${port}`);
  } else if (isWatch) {
    const ctx = await esbuild.context(esbuildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(esbuildOptions);
    console.log('Build finished.');
  }
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});