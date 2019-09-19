import flowEntry  from 'rollup-plugin-flow-entry';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/http-client.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/http-client.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/http-client.umd.js',
      format: 'umd',
      name: 'LK_HTTP_CLIENT',
      sourcemap: true,
    },
  ],
  plugins: [flowEntry(), terser(), resolve(), commonjs()],
};

export default config;
