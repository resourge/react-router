import importSync from 'import-sync';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createMatchPath, loadConfig } from 'tsconfig-paths';
import ts, { type CompilerOptions } from 'typescript';

import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { type VitePathRouteMetadata, type ViteRouteMetadata } from './type';
import { replaceExtension } from './utils';

export const tsConfig = loadConfig();

export function convertPathRouteMetadataToRouteMetadata(
	config: DefaultViteReactRouterConfig,
	routeMetadata: VitePathRouteMetadata
): ViteRouteMetadata {
	const title = getDefaultValue(config, routeMetadata.title);
	const description = getDefaultValue(config, routeMetadata.description);
	const keywords = getDefaultValue(config, routeMetadata.keywords);
	const route = routeMetadata.route;
	const isPrivate = routeMetadata.isPrivate;

	return {
		description,
		isPrivate,
		keywords,
		route,
		title
	};
}

// eslint-disable-next-line max-params
export function getRouteMetadata(
	fileName: string,
	code: string,
	cacheOutDir: string,
	options: CompilerOptions,
	config: DefaultViteReactRouterConfig
) {
	return new Promise<ViteRouteMetadata>((resolve, reject) => {
		const { outDir } = options;
		if ( tsConfig.resultType === 'failed' ) {
			// eslint-disable-next-line unicorn/error-message
			reject(new Error());
			return;
		}

		const outDirPath = path.resolve(tsConfig.absoluteBaseUrl, outDir ?? '');
		const resolvePath = createMatchPath(
			outDirPath, 
			tsConfig.paths, 
			tsConfig.mainFields, 
			tsConfig.addMatchAll
		);

		const host = ts.createWatchCompilerHost(
			[fileName],
			options,
			ts.sys,
			ts.createSemanticDiagnosticsBuilderProgram,
			undefined,
			async (diagnostics) => {
				if (diagnostics.code !== 6031) {
					const newId = fileName.split('src');
					const newFileName = pathToFileURL(
						replaceExtension(
							path
							.join(
								cacheOutDir, 
								'src', 
								newId.at(-1) ?? ''
							),
							'.js'
						)
					).toString()
					.replace('.tsx', '.js');

					const module = await importSync(`${newFileName}?date=${new Date().toISOString()}`);

					const routeMetadata = convertPathRouteMetadataToRouteMetadata(
						config,
						module.default.routeMetadata
					);

					close();

					resolve(routeMetadata);
				}
			},
			undefined,
			{
				watchFile: ts.WatchFileKind.PriorityPollingInterval
			}
		);

		const originalAfterProgramCreate = host.afterProgramCreate;
		const originalReadFile = host.readFile;
		
		host.readFile = (fileNameHost) => {
			return fileNameHost === fileName
				? code
				: originalReadFile(fileNameHost);
		};
		host.afterProgramCreate = (builderProgram) => {
			const originalEmit = builderProgram.emit;
			// eslint-disable-next-line max-params
			builderProgram.emit = (targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers): ts.EmitResult => {
				const transformers = customTransformers ?? {
					before: [] 
				};
				transformers.before ??= [];
				transformers.before.push(
					(context) => {
						const { factory } = context;
						return (rootNode) => {
							return factory.updateSourceFile(
								rootNode,
								rootNode.statements.map((node: any) => {
									if (node.moduleSpecifier && node.moduleSpecifier.text.includes('src')) {
										return factory.updateImportDeclaration(
											node,
											node.modifiers,
											node.importClause,
											factory.createStringLiteral(
												resolvePath(`${node.moduleSpecifier.text as string}.js`) ?? ''
											),
											node.assertClause
										);
									}
									return node;
								})
							);
						};
					}
				);

				return originalEmit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, transformers);
			};
			if (originalAfterProgramCreate) {
				originalAfterProgramCreate(builderProgram); 
			}
		};

		const { close } = ts.createWatchProgram(host);
	});
}

function getDefaultValue<T extends (Record<string, string> | string) | (
	Record<string, string[]> | string[]
)>(
	config: DefaultViteReactRouterConfig, 
	value: T
): T extends (Record<string, string> | string) ? Record<string, string> : Record<string, string[]> {
	return (
		typeof value === 'string' || Array.isArray(value)
			? {
				[config.defaultLanguage]: value
			}
			: value
	) as T extends (Record<string, string> | string) ? Record<string, string> : Record<string, string[]>;
}
