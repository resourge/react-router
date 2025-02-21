/* eslint-disable prefer-regex-literals */
import fs from 'fs';
import path from 'path';
import { type ConfigLoaderSuccessResult } from 'tsconfig-paths';
import ts from 'typescript';
import { type PluginOption, type ResolvedConfig } from 'vite';

import { addFile } from './utils/addFile';
import { createHtmlFiles, type FilesType } from './utils/createHtmlFiles';
import { createSiteMap } from './utils/createSiteMap';
import { getDefaultViteConfig, type ViteReactRouterConfig } from './utils/getDefaultViteConfig';
import { getRouteMetadata, tsConfig, convertPathRouteMetadataToRouteMetadata } from './utils/getRouteMetadata';
import { type ViteRouteMetadata } from './utils/type';
import { stripCodeOfUnnecessaryCode } from './utils/utils';

const {
	ModuleKind,
	ModuleResolutionKind,
	ScriptTarget,
	JsxEmit
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
						noEmitOnError: false,
						noImplicitAny: true,
						target: ScriptTarget.ES2016,
						module: ModuleKind.ES2020,
						moduleResolution: ModuleResolutionKind.NodeJs,
						outDir: cacheOutDir,
						baseUrl: path.resolve(projectPath, './'),
						rootDir: path.resolve(projectPath, './'),
						types: ['vite/client'],
						removeComments: false,
						jsx: JsxEmit.ReactJSX,
						paths: (tsConfig as ConfigLoaderSuccessResult).paths,
						allowSyntheticDefaultImports: true,
						allowJs: true
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
		async closeBundle() {
			const fitInAllRoutes = routeMetadata
			.filter(({ route }) => route.includes('{*}?'))
			.map(({ route, ...rest }) => ({
				...rest,
				route: route.replace('{*}?', '')
			}));

			const validRouteMetadata = routeMetadata
			.filter(({ route, isPrivate }) => 
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
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const newRoutes = await Promise.resolve(_config.onDynamicRoutes!(item));

							if ( newRoutes && newRoutes.length ) {
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

							return undefined;
						})
					) 
				)
				.filter(Boolean)
				.flat() as ViteRouteMetadata[]
				: [];

			const pages: FilesType[] = [
				...validRouteMetadata
				.filter(({ route }) => !route.includes(':')),
				...dynamicValidRouteMetadata
			]
			.map((item) => {
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
			})
			.flat();

			const maxFileNameLength = Math.max(...pages.map(({ fileName }) => fileName.length));

			const files = await createHtmlFiles({
				pages, 
				html, 
				rootConfig,
				config: _config,
				maxFileNameLength
			});

			if ( _config.url ) {
				files.push(
					await createSiteMap({
						pages, 
						maxFileNameLength,
						outputPath,
						config: _config
					})
				);
			}

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
