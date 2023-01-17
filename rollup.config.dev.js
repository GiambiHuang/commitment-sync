import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { wasm } from '@rollup/plugin-wasm';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'commitmentSyncStore',
			// file: pkg.main,
			file: 'public/index.js',
			format: 'iife',
      sourcemap: true,
      inlineDynamicImports: true
		},
		plugins: [
			typescript(),
      resolve(),
      wasm({
        fileName: '[name][extname]'
      })
		]
	},
];
