/// <reference types="vitest" />
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import viteTsconfigPaths from 'vite-tsconfig-paths';

import PackageJson from './package.json';

import { createBanner } from './config/createBanner';

const {
	dependencies = {}, devDependencies = {}, peerDependencies = {}
} = PackageJson;

const external = Array.from(
	new Set([
		'crypto',
		'dgram',
		'diagnostics_channel',
		'dns',
		'dns/promises',
		'domain',
		'events',
		'fs',
		'fs/promises',
		'http',
		'http2',
		'https',
		'inspector',
		'inspector/promises',
		'module',
		'net',
		'os',
		'path',
		'path/posix',
		'path/win32',
		'perf_hooks',
		'process',
		'punycode',
		'querystring',
		'readline',
		'readline/promises',
		'repl',
		'stream',
		'stream/consumers',
		'stream/promises',
		'stream/web',
		'string_decoder',
		'timers',
		'timers/promises',
		'tls',
		'trace_events',
		'tty',
		'url',
		'util',
		'util/types',
		'v8',
		'vm',
		'wasi',
		'worker_threads',
		'zlib',
		'react/jsx-runtime',
		...Object.keys(peerDependencies),
		...Object.keys(dependencies),
		...Object.keys(devDependencies),
		'@resourge/history-store/mobile',
		'@resourge/history-store/utils',
		'@resourge/history-store/dist/types/navigationActionType/NavigationActionType',
		'@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native'
	]).values()
);

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
	},
	build: {
		emptyOutDir: false,
		minify: false,
		lib: {
			entry: './src/vite/vite.ts',
			name: 'vite',
			fileName: 'vite',
			formats: ['es']
		},
		sourcemap: true,
		outDir: './dist/vite',
		rollupOptions: {
			output: {
				dir: './dist/vite',
				inlineDynamicImports: false,
				
				entryFileNames: 'vite.js' // Ensures main file name does not have an extension
			},
			external,
			plugins: [
				nodeResolve({
					extensions: ['.tsx', '.ts', '.native.ts', '.native.tsx']
				})
			]
		}
	},
	plugins: [
		banner(createBanner()),
		viteTsconfigPaths(),
		checker({ 
			typescript: true,
			enableBuild: true,
			overlay: {
				initialIsOpen: false
			},
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
			}
		}),
		dts({
			outDir: 'dist/vite',
			include: ['./src/vite/**/*'],
			exclude: [
				'src/lib/**/*',
				'**/*.test*',
				'./src/App.tsx',
				'./src/main.tsx',
				'./src/setupTests.ts'
			],
		})
	]
});