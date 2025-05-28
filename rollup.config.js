export default [
  // ESM build (modern import)
  {
    input: 'src/dcl.js',
    output: {
      file: 'dist/dcl.module.js',
      format: 'es',
      sourcemap: true
    }
  },
  // UMD build (browser and require)
  {
    input: 'src/dcl.js',
    output: {
      file: 'dist/dcl.js',
      format: 'umd',
      name: 'dcl',
      sourcemap: true,
      exports: 'named'
    }
  }
];