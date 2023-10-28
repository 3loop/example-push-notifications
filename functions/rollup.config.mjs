import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

/**
 * Add here external dependencies that actually you use.
 */
const externals = [
  'cors',
  'firebase-functions',
  'firebase-admin',
  'ethers',
  'ws',
  'jsonata',
  '@google-cloud/pubsub',
];

export default {
  input: 'src/index.ts',
  external: externals,
  plugins: [
    typescript(),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs(),
    json(),
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    sourcemap: true,
  }
}