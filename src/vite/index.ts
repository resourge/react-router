/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable prefer-regex-literals */
import ansi from 'ansi-colors';
import fs from 'fs';
import fsp from 'fs/promises';
import { minify as minifyFn, type Options as MinifyOptions } from 'html-minifier-terser';
import { parse } from 'node-html-parser';
import path from 'path';
import { type ConfigLoaderSuccessResult } from 'tsconfig-paths';
import ts from 'typescript';
import { type PluginOption } from 'vite';

import { addFile } from './utils/addFile';
import { tsConfig, getRouteMetadata } from './utils/getRouteMetadata';
import { type InMemoryCode } from './utils/type';
import { stripCodeOfUnnecessaryCode } from './utils/utils';

const {
	ModuleKind,
	ModuleResolutionKind,
	ScriptTarget
} = ts;
type ViteReactRouterConfig = {
	url: string
	description?: string | Record<string, string>
	keywords?: string[] | Record<string, string[]>
	title?: string | Record<string, string>
}

type FilesType = { 
	fileName: string
	url: string
	description?: string
	keywords?: string[]
	title?: string
	translation?: string
}

const routeMetadataReg = new RegExp('\\.routeMetadata\\s{0,}=\\s{0,}(setRouteMetadata)\\(([\\s\\S]*?)\\)', 'g');

export const viteReactRouter = (config?: ViteReactRouterConfig): PluginOption => {
	const projectPath = (tsConfig as ConfigLoaderSuccessResult).configFileAbsolutePath.replace('tsconfig.json', '');

	const cacheOutDir = path.resolve(projectPath, '.cache');

	let outputPath: string;
	let rootConfig: any;
	let html: string;

	function getOptions(minify: boolean): MinifyOptions {
		return {
			collapseWhitespace: minify,
			keepClosingSlash: minify,
			removeComments: minify,
			removeRedundantAttributes: minify,
			removeScriptTypeAttributes: minify,
			removeStyleLinkTypeAttributes: minify,
			useShortDoctype: minify,
			minifyCSS: minify
		};
	}

	function ensureDirectoryExists(filePath: string): void {
		const dirname = path.dirname(filePath);
		if (!fs.existsSync(dirname)) {
			fs.mkdirSync(dirname, {
				recursive: true 
			});
		}
	}

	const routesFileCode: InMemoryCode = {};

	return {
		name: 'vite-react-router',
		enforce: 'post',
		apply: 'build',
		buildStart: () => {
			if ( !fs.existsSync(cacheOutDir) ) {
				fs.mkdirSync(cacheOutDir);
			}
		},
		configResolved(c) {
			rootConfig = c;
			outputPath = c.build.outDir;
		},
		transformIndexHtml: {
			order: 'post',
			handler(code) {
				html = code;
			}
		},
		transform(code, id) {
			if ( routeMetadataReg.test(code) ) {
				const match = /([a-zA-Z0-9]+)\.routeMetadata\s{0,}=\s{0,}(setRouteMetadata)\(([\s\S]*?)\);/g.exec(code);
				if ( match ) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [_code, page] = match;

					routesFileCode[id] = stripCodeOfUnnecessaryCode(code, page);
				}
			}
		},
		async closeBundle() {		
			const routeMetadata = await getRouteMetadata(
				routesFileCode, 
				cacheOutDir,
				{
					noEmitOnError: false,
					noImplicitAny: true,
					target: ScriptTarget.ES2016,
					module: ModuleKind.ES2020,
					moduleResolution: ModuleResolutionKind.NodeJs,
					outDir: cacheOutDir,
					baseUrl: path.resolve(projectPath, './'),
					rootDir: path.resolve(projectPath, './'),
					types: ['vite/client'],
					paths: (tsConfig as ConfigLoaderSuccessResult).paths,
					allowSyntheticDefaultImports: true,
					allowJs: true
				}
			);

			const filesNames: string[] = [];

			const fitInAllRoutes = routeMetadata
			.filter(({ route }) => route.includes('{*}?'))
			.map(({ route, ...rest }) => ({
				...rest,
				route: route.replace('{*}?', '')
			}));

			const pages: FilesType[] = routeMetadata
			.filter(({ route }) => !(route.includes('#') || route.includes(':') || route.includes('{*}?')))
			.map((item) => {
				const newFiles = addFile(
					(route, translation = '') => path.join(outputPath, translation, route), 
					item,
					outputPath,
					filesNames,
					config
				);

				fitInAllRoutes.forEach((fitInAllRoutesItem) => {
					newFiles.push(
						...addFile(
							(route, translation = '') => path.join(outputPath, translation, item.route, route), 
							fitInAllRoutesItem,
							outputPath,
							filesNames,
							config
						)
					);
				});

				return newFiles;
			})
			.flat();
							
			const root = parse(html);
			const maxFileNameLength = Math.max(...filesNames.map((filesName) => filesName.length));

			function findOrCreateMeta(metaName: string, value: string, propertyName: string = 'name') {
				const head = root.querySelector('head');
				const querySelectorString = `meta[${propertyName}="${metaName}"]`;
				let metaDescription = root.querySelector(querySelectorString);
				if ( !metaDescription ) {
					head?.insertAdjacentHTML('beforeend', `<meta ${propertyName}="${metaName}" content="">`);
					metaDescription = root.querySelector(querySelectorString);
				}
				metaDescription?.setAttribute('content', value);
			}

			function findOrCreateMetaProperty(metaName: string, value: string) {
				findOrCreateMeta(metaName, value, 'property');
			}

			function findOrCreateMetaItemProp(metaName: string, value: string) {
				findOrCreateMeta(metaName, value, 'itemprop');
			}

			const files = await Promise.all(
				pages
				.map(async ({
					url, fileName, title = '', description, keywords, translation 
				}) => {
					const titleComponent = root.querySelector('title');

					const htmlElement = root.querySelector('html');
					if ( !translation ) {
						htmlElement?.removeAttribute('lang');
					}
					else {
						htmlElement?.setAttribute('lang', translation);
					}

					if ( titleComponent ) {
						titleComponent.innerHTML = title ?? '';
					}

					if ( config && config.url ) {
						findOrCreateMetaProperty(
							'og:url', 
							`${config.url}${url}`
						);

						findOrCreateMetaProperty(
							'twitter:url', 
							`${config.url}${url}`
						);
					}

					findOrCreateMeta(
						'title', 
						title
					);
					findOrCreateMetaProperty(
						'og:title', 
						title
					);
					findOrCreateMetaProperty(
						'twitter:title', 
						title
					);
					findOrCreateMetaItemProp(
						'name', 
						title
					);

					if ( description ) {
						findOrCreateMeta('description', description);
						findOrCreateMetaProperty('og:description', description);
						findOrCreateMetaProperty('twitter:description', description);
						findOrCreateMetaItemProp(
							'description', 
							description
						);
					}

					if ( keywords ) {
						findOrCreateMeta('keywords', keywords.join(', '));
					}
										
					ensureDirectoryExists(fileName);

					await fsp.writeFile(
						fileName, 
						await minifyFn(root.toString(), getOptions(true))
					);

					const stats = fs.statSync(fileName);
					const size = `${(stats.size / 1024).toFixed(2)} kB`;
					return `${ansi.dim(`${path.dirname(fileName)}/`)}${ansi.cyan(path.basename(fileName))}${' '.repeat(3 + (maxFileNameLength - fileName.length))}${size}`;
				})
			);

			files.forEach((message) => {
				rootConfig.logger.info(message);
			});

			fs.rmSync(cacheOutDir, {
				recursive: true,
				force: true 
			});
		}
	};
};
