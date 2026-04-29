import fs from 'node:fs';
import path from 'node:path';
import { type ConfigLoaderSuccessResult } from 'tsconfig-paths';
import ts from 'typescript';
import { type PluginOption, type ResolvedConfig } from 'vite';

import { addFile } from './utils/addFile';
import { createHtmlFiles, type FilesType } from './utils/createHtmlFiles';
import { createSiteMap } from './utils/createSiteMap';
import { getDefaultViteConfig, type ViteReactRouterConfig } from './utils/getDefaultViteConfig';
import { convertPathRouteMetadataToRouteMetadata, getRouteMetadata, tsConfig } from './utils/getRouteMetadata';
import { type ViteRouteMetadata } from './utils/type';
import { stripCodeOfUnnecessaryCode } from './utils/utils';

const {
	JsxEmit,
	ModuleKind,
	ModuleResolutionKind,
	ScriptTarget
} = ts;

export const viteReactRouter = (config?: ViteReactRouterConfig): PluginOption => {
	const _config = getDefaultViteConfig(config);

	const projectPath = (tsConfig as ConfigLoaderSuccessResult).configFileAbsolutePath.replace('tsconfig.json', '');

	const cacheOutDir = path.resolve(projectPath, '.cache');

	let outputPath: string;
	let rootConfig: ResolvedConfig;
	let html: string;

	const routeMetadata: ViteRouteMetadata[] = [];

	return {
		apply: 'build',
		buildStart: () => {
			if ( !fs.existsSync(cacheOutDir) ) {
				fs.mkdirSync(cacheOutDir);
			}
		},
		async closeBundle() {
			const fitInAllRoutes = routeMetadata
			.filter(({ route }) => route.includes('{*}?'))
			.map(({ route, ...rest }) => ({
				...rest,
				route: route.replace('{*}?', '')
			}));

			const validRouteMetadata = routeMetadata
			.filter(({ isPrivate, route }) => 
				!(
					route.includes('#') 
					|| route.includes('{*}?')
					|| (route === '/' && _config.defaultInitialRoute !== '/')
				) 
				&& !isPrivate
			);

			const dynamicValidRouteMetadata = _config.onDynamicRoutes
				? (
					await Promise.all(
						validRouteMetadata
						.filter(({ route }) => route.includes(':'))
						.map(async (item) => {
							const newRoutes = await Promise.resolve(_config.onDynamicRoutes!(item));

							if ( newRoutes && newRoutes.length > 0 ) {
								return newRoutes.map((newRouteMetadata) => 
									convertPathRouteMetadataToRouteMetadata(
										_config,
										{
											...item,
											...newRouteMetadata
										}
									)
								);
							}

							return;
						})
					) 
				)
				// eslint-disable-next-line unicorn/no-await-expression-member
				.filter(Boolean)
				.flat() as ViteRouteMetadata[]
				: [];

			const pages: FilesType[] = [
				...validRouteMetadata
				.filter(({ route }) => !route.includes(':')),
				...dynamicValidRouteMetadata
			]
			.flatMap((item) => {
				const newFiles = addFile(
					(route, translation = '') => path.join(outputPath, translation, route), 
					item,
					_config
				);

				fitInAllRoutes.forEach((fitInAllRoutesItem) => {
					newFiles.push(
						...addFile(
							(route, translation = '') => path.join(outputPath, translation, item.route, route), 
							fitInAllRoutesItem,
							_config
						)
					);
				});

				return newFiles;
			});

			const maxFileNameLength = Math.max(...pages.map(({ fileName }) => fileName.length));

			const files = await createHtmlFiles({
				config: _config, 
				html, 
				maxFileNameLength,
				pages,
				rootConfig
			});

			if ( _config.url ) {
				files.push(
					await createSiteMap({
						config: _config, 
						maxFileNameLength,
						outputPath,
						pages
					})
				);
			}

			files.forEach((message) => {
				rootConfig.logger.info(message);
			});

			fs.rmSync(cacheOutDir, {
				force: true,
				recursive: true 
			});
		},
		configResolved(c) {
			rootConfig = c;
			outputPath = c.build.outDir;
		},
		enforce: 'post',
		name: 'vite-react-router',
		async transform(code, id) {
			const match = /([a-zA-Z0-9]+)\.routeMetadata\s{0,}=\s{0,}/g.exec(code);
			if (match) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [_, page] = match;

				const {
					fileContent, objectEndIndex, objectStartIndex 
				} = stripCodeOfUnnecessaryCode(code, page);

				const routeMetadataCode = await getRouteMetadata(
					id,
					fileContent, 
					cacheOutDir,
					{
						allowJs: true,
						allowSyntheticDefaultImports: true,
						baseUrl: path.resolve(projectPath, './'),
						jsx: JsxEmit.ReactJSX,
						module: ModuleKind.ES2020,
						moduleResolution: ModuleResolutionKind.NodeJs,
						noEmitOnError: false,
						noImplicitAny: true,
						outDir: cacheOutDir,
						paths: (tsConfig as ConfigLoaderSuccessResult).paths,
						removeComments: false,
						rootDir: path.resolve(projectPath, './'),
						target: ScriptTarget.ES2016,
						types: ['vite/client']
					},
					_config
				);

				if ( routeMetadataCode ) {
					routeMetadata.push(routeMetadataCode);

					const rMetadata = {
						...routeMetadataCode 
					};
	
					// @ts-expect-error expected
					delete rMetadata.route;

					if ( objectEndIndex !== null && objectStartIndex !== null ) {
						return `${code.slice(0, objectStartIndex)}${JSON.stringify(rMetadata)}${code.slice(objectEndIndex)}`;
					}
				}

				return code;
			}
		},
		transformIndexHtml: {
			handler(code) {
				html = code;
			},
			order: 'post'
		}
	};
};
