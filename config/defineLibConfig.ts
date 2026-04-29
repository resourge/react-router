/// <reference types="vitest/config" />
import deepmerge from '@fastify/deepmerge';
import { copyFileSync } from 'node:fs';
import { defineConfig, type UserConfigExport } from 'vite';
import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

import PackageJson from '../package.json';

import { createBanner } from './createBanner';

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
		'node:fs',
		'node:fs/promises',
		'node:path',
		'node:url',
		'os',
		'path',
		'path/posix',
		'path/win32',
		'perf_hooks',
		'process',
		'punycode',
		'querystring',
		'react/jsx-runtime',
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
		...Object.keys(peerDependencies),
		...Object.keys(dependencies),
		...Object.keys(devDependencies),
		'@resourge/history-store/mobile',
		'@resourge/history-store/utils'
	]).values()
);

const entryLib = './src/lib/index.ts';
const entryNativeLib = './src/lib/index.native.ts';

const deepMerge = deepmerge();

export const defineLibConfig = (
	config: UserConfigExport
): UserConfigExport => defineConfig((originalConfig) => deepMerge(
	typeof config === 'function'
		? config(originalConfig)
		: config,
	{
		build: {
			lib: {
				entry: {
					'index': entryLib,
					'index.native': entryNativeLib
				},
				fileName: 'index',
				formats: ['es'],
				name: 'index'
			},
			minify: false,
			outDir: './dist',
			rollupOptions: {
				external,
				output: {
					codeSplitting: true,
					dir: './dist',
					entryFileNames: '[name].js', // Ensures main file name does not have an extension
					preserveModules: true
					// chunkFileNames: (chunkInfo) => chunkInfo.name.split('lib/')[1]
				}
			},
			sourcemap: true
		},
		plugins: [
			banner(createBanner()),
			checker({ 
				enableBuild: true,
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
				},
				overlay: {
					initialIsOpen: false
				},
				typescript: true
			}),
			dts({
				beforeWriteFile(filePath: string, content: string) {
					if ( filePath.includes('dist/index.d.ts') ) {
						return {
							content: `import './global.d';\nimport 'urlpattern-polyfill';\n${content}`,
							filePath
						};
					}
					if ( filePath.includes('dist/index.native.d.ts') ) {
						return {
							content: `import 'urlpattern-polyfill';\n${content}`,
							filePath
						};
					}
				},
				compilerOptions: {
					baseUrl: '.',
					removeComments: false
				},
				exclude: [
					'./src/vite/**/*',
					'**/*.test*',
					'./src/App.tsx',
					'./src/main.tsx',
					'./src/setupTests.ts'
				],
				insertTypesEntry: true
			}),
			{
				closeBundle() {
					copyFileSync('src/lib/global.d.ts', 'dist/global.d.ts');
				},
				name: 'copy-global-dts'
			},
			{
				generateBundle(_, bundle) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					for (const [_, value] of Object.entries(bundle)) {
						if (value.type === 'chunk') {
							value.code = value.code.replaceAll(/(?<=import\s+.*?['"])([^'"]+)\.js(?=['"])/g, '$1');
						}
					}
				},
				name: 'remove-file-extensions'
			}
		],
		resolve: {
			preserveSymlinks: true,
			tsconfigPaths: true
		},
		test: {
			environment: 'jsdom',
			globals: true,
			setupFiles: './src/setupTests.ts'
		}
	}
));
