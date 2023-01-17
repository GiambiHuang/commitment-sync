import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { wasm } from '@rollup/plugin-wasm';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

// import pkg from './package.json';

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
		// external: ['findora-wallet-wasm'],
		plugins: [
			typescript(),
      resolve(),
      wasm(),
			webWorkerLoader({
				extensions: ['.ts']
			}),
		]
	},
];
