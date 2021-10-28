import path from 'path'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import 

import pkg from './package.json'

const paths = {
  input: path.join(__dirname, '/src/tyro.ts'),
  output: path.join(__dirname, '/lib'),
}

export default {
  input: paths.input,
  output: [
    {
      file: path.join(paths.output, 'index.js'),
      format: 'cjs',
      name: pkg.name,
    },
    {
      file: path.join(paths.output, 'index.esm.js'),
      format: 'es',
      name: pkg.name,
    },
    {
      file: path.join(paths.output, 'index.umd.js'),
      format: 'umd',
      name: pkg.name,
    },
  ],
  plugins: [

  ]
}