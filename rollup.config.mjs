import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs, { readFileSync } from 'fs';
import { defineConfig } from 'rollup';
import filsesize from 'rollup-plugin-filesize';
import ts from 'rollup-plugin-ts';
// import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const pkg = JSON.parse(readFileSync('package.json', {
	encoding: 'utf8'
}));

const {
	name, author, license, peerDependencies = {}, dependencies = {}, devDependencies = {}
} = pkg;

const defaultExtPlugin = [
	filsesize({
		showBeforeSizes: 'build'
	}),
	nodeResolve({
		extensions: ['.tsx', '.ts', '.native.ts', '.native.tsx']
	})
];

function createBanner(libraryName, version, authorName, license) {
	return `/**
 * ${libraryName} v${version}
 *
 * Copyright (c) ${authorName}.
 *
 * This source code is licensed under the ${license} license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license ${license}
 */`;
}

function getName(name) {
	const arr = name.split('/');

	return arr.at(-1);
}

/**
 * Package Json info
 */
const VERSION = process.env.PROJECT_VERSION;
const AUTHOR_NAME = author;
const LICENSE = license;
const OUTPUT_DIR = './dist';
const SOURCEMAP = true;
const PACKAGE_NAME = name;
const SOURCE_FOLDER = './src/lib';
const SOURCE_INDEX_FILE = `${SOURCE_FOLDER}/index.ts`;
const SOURCE_NATIVE_INDEX_FILE = `${SOURCE_FOLDER}/index.native.ts`;
const EXTERNAL = Array.from(
	new Set([
		...Object.keys(peerDependencies),
		...Object.keys(dependencies),
		...Object.keys(devDependencies),
		'react/jsx-runtime',
		'@resourge/react-search-params/dist/utils/parseSearch'
	]).values()
);

const PROJECT_NAME = getName(PACKAGE_NAME);
const { banner } = createBanner(PROJECT_NAME, VERSION, AUTHOR_NAME, LICENSE);

function indexBundle() {
	const declarationPaths = new Set();

	return defineConfig({
		input: [SOURCE_INDEX_FILE, SOURCE_NATIVE_INDEX_FILE, './src/lib/utils/window/window.native.ts'],
		output: {
			dir: OUTPUT_DIR,
			format: 'esm',
			sourcemap: SOURCEMAP,
			banner,
			preserveModules: true,
			entryFileNames: '[name].js',
			chunkFileNames: (chunkInfo) => chunkInfo.name.split('lib/')[1]
		},
		external: EXTERNAL,
		plugins: [
			...defaultExtPlugin,
			commonjs(),
			typescriptPaths(),
			json(),
			ts({
				tsconfig: 'tsconfig.d.json',
				browserslist: false,

				hook: {
					outputPath(filePath, kind) {
						if (kind === 'declaration') {
							declarationPaths.add(filePath);
						}
					}
				}
			}),
			{
				writeBundle() {
					const fixTypes = [
						'[K in keyof R]: PathType<IsHashPath<R[K][\'_key\']> extends true ? R[K][\'_key\'] : IncludeSlash<R[K][\'_key\']>, R[K][\'_params\'], R[K][\'_paramsResult\'], R[K][\'_searchParams\'], R[K][\'_routes\']>;',
						'[K in keyof Routes]: PathType<ResolveSlash<[IsHashPath<Routes[K][\'_key\']> extends true ? \'\' : BaseKey, Routes[K][\'_key\']]>, IsHashPath<Routes[K][\'_key\']> extends true ? Routes[K][\'_params\'] : MergeObj<Params, Routes[K][\'_params\']>, IsHashPath<Routes[K][\'_key\']> extends true ? Routes[K][\'_paramsResult\'] : MergeObj<ParamsResult, Routes[K][\'_paramsResult\']>, Routes[K][\'_searchParams\'], Routes[K][\'_routes\']>;',
						'[K in keyof Routes]: Path<AddConfigParamsIntoRoutes<Routes[K][\'_routes\'], IsHashPath<Routes[K][\'_key\']> extends true ? Routes[K][\'_params\'] : MergeObj<Params, Routes[K][\'_params\']>, IsHashPath<Routes[K][\'_key\']> extends true ? Routes[K][\'_paramsResult\'] : MergeObj<ParamsResult, Routes[K][\'_paramsResult\']>>, Routes[K][\'_key\'], Routes[K][\'_params\'], Routes[K][\'_paramsResult\'], Routes[K][\'_searchParams\']>;'
					];
					declarationPaths.forEach(async (path) => {
						let content = await fs.promises.readFile(path, 'utf-8');

						// Change declare to export
						// content = content.replace(/declare/g, 'export declare');

						// Remover last export
						// const lastExport = content.lastIndexOf('export {');
						// content = content.substring(0, lastExport);

						// Remove last line break
						// const lastLine = content.lastIndexOf('\n');
						// content = content.substring(0, lastLine);

						fixTypes.forEach((b) => {
							content = content.replace(b, `// @ts-expect-error Want to protect value, but also access it with types\n\t${b}`);
						});

						if (
							path.includes('dist/index.d.ts')
							|| path.includes('dist/index.native.d.ts')
						) {
							content = 'import \'urlpattern-polyfill\';\n' 
							+ content
							+ (
								path.includes('dist/index.d.ts') 
									? 'import { type RouteMetadataType } from "./types/index.js";\ndeclare module \'react\' {\n\texport interface FunctionComponent {\n\t\trouteMetadata?: RouteMetadataType<any, any, any>\n\t}\n}' 
									: ''
							);
						}

						await fs.promises.writeFile(path, [
							banner,
							content
						].join('\n'), 'utf-8');
					});
				}
			}
		]
	});
}

function viteBundle() {
	const viteIndex = './src/vite/index.ts';

	return {
		input: viteIndex,
		output: {
			file: `${OUTPUT_DIR}/vite.mjs`,
			format: 'esm',
			sourcemap: SOURCEMAP,
			banner
		},
		external: EXTERNAL,
		plugins: [
			...defaultExtPlugin,
			typescriptPaths(),
			ts({
				tsconfig: 'tsconfig.d.json',
				browserslist: false
			})
		]
	};
}

export default function rollup() {
	return [
		indexBundle(),
		viteBundle()
	];
}
